import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { CreateOrderInput, OrderFilters } from '@/lib/types/order';

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

// GET /api/orders - Récupérer toutes les commandes avec filtres
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);

    // Extraire les filtres depuis les query params
    const filters: OrderFilters = {
      status: searchParams.get('status') as any || undefined,
      payment_status: searchParams.get('payment_status') as any || undefined,
      payment_method: searchParams.get('payment_method') as any || undefined,
      customer_phone: searchParams.get('customer_phone') || undefined,
      order_number: searchParams.get('order_number') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
    };

    // Construire la requête
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }
    if (filters.customer_phone) {
      query = query.eq('customer_phone', filters.customer_phone);
    }
    if (filters.order_number) {
      query = query.ilike('order_number', `%${filters.order_number}%`);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      // Ajouter un jour pour inclure toute la journée
      const dateTo = new Date(filters.date_to);
      dateTo.setDate(dateTo.getDate() + 1);
      query = query.lt('created_at', dateTo.toISOString());
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
