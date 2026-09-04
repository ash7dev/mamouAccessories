import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { CreateOrderInput, OrderFilters } from '@/lib/types/order';
import { broadcastOrderPushNotification } from '@/lib/server/push-server';

// GET /api/orders - Récupérer toutes les commandes ou filtrer par order_number
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const orderNumber = request.nextUrl.searchParams.get('order_number');

    if (orderNumber) {
      const { data: rawOrders, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            product_name,
            unit_price,
            quantity
          )
        `)
        .eq('order_number', orderNumber);

      if (error) {
        console.error('Error fetching order by order_number:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération de la commande' }, { status: 500 });
      }

      return NextResponse.json({ orders: rawOrders || [] }, { status: 200 });
    }

    const { data: rawOrders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        total,
        status,
        payment_method,
        payment_status,
        created_at,
        order_items (
          id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    // Format orders for admin list
    const orders = (rawOrders || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      itemsCount: order.order_items?.length || 0,
      total: order.total,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
    }));

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body: CreateOrderInput = await request.json();

    // Validation des champs requis
    if (!body.customer_name || !body.customer_phone || !body.delivery_address) {
      return NextResponse.json(
        { error: 'Les champs customer_name, customer_phone et delivery_address sont requis' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'La commande doit contenir au moins un article' },
        { status: 400 }
      );
    }

    // Récupérer les informations des produits
    const productIds = body.items.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', productIds);

    if (productsError || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Produits non trouvés' },
        { status: 404 }
      );
    }

    // Vérifier le stock et calculer le sous-total
    let subtotal = 0;
    const orderItems = [];

    for (const item of body.items) {
      const product = products.find(p => p.id === item.product_id);

      if (!product) {
        return NextResponse.json(
          { error: `Produit ${item.product_id} non trouvé` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}` },
          { status: 400 }
        );
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
      });
    }

    // Calculer le total
    const total = subtotal + body.delivery_fee;

    // Générer le numéro de commande
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du numéro de commande' },
        { status: 500 }
      );
    }

    const orderNumber = orderNumberData as string;

    // Déterminer le statut de paiement initial
    let paymentStatus: 'unpaid' | 'pending_verification' = 'unpaid';
    if (body.payment_method === 'wave' && body.payment_proof_url) {
      paymentStatus = 'pending_verification';
    }

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        delivery_address: body.delivery_address,
        delivery_note: body.delivery_note || null,
        payment_method: body.payment_method,
        payment_status: paymentStatus,
        payment_proof_url: body.payment_proof_url || null,
        subtotal,
        delivery_fee: body.delivery_fee,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    // Ajouter les articles à la commande
    const itemsToInsert = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Supprimer la commande si l'ajout des items échoue
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout des articles' },
        { status: 500 }
      );
    }

    // Décrémenter le stock des produits
    for (const item of body.items) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', product.id);
      }
    }

    // Récupérer la commande complète avec les items
    const { data: orderWithItems } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', order.id)
      .single();

    // Broadcast Web Push VAPID Notification vers l'administration
    broadcastOrderPushNotification({
      orderNumber: order.order_number,
      customerName: body.customer_name,
      total,
      orderId: order.id,
    }).catch(err => console.error('Error broadcasting push notification:', err));

    return NextResponse.json(
      { order: orderWithItems },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

