import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { deleteImages } from '@/lib/cloudinary';
import type { UpdateProductInput } from '@/lib/types/product';

// GET /api/products/[id] - Récupérer un produit par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(name)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body: UpdateProductInput = await request.json();

    // Vérifier que le produit existe
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Si le slug est modifié, vérifier qu'il est unique
    if (body.slug) {
      const { data: slugExists } = await supabase
        .from('products')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ce slug existe déjà' },
          { status: 409 }
        );
      }
    }

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {};
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.compare_at_price !== undefined) updateData.compare_at_price = body.compare_at_price;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.image_orientation !== undefined) updateData.image_orientation = body.image_orientation;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Mettre à jour le produit
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du produit' },
        { status: 500 }
      );
    }

    // Si de nouvelles images sont fournies, gérer la suppression des anciennes sur Cloudinary
    if (body.cloudinary_public_ids !== undefined) {
      // Récupérer les anciennes images enregistrées en BDD
      const { data: oldImages } = await supabase
        .from('product_images')
        .select('cloudinary_public_id')
        .eq('product_id', id);

      const newPublicIdSet = new Set(body.cloudinary_public_ids);
      const removedPublicIds = (oldImages || [])
        .map((img) => img.cloudinary_public_id)
        .filter(
          (pid) =>
            pid &&
            !newPublicIdSet.has(pid) &&
            !pid.startsWith('http://') &&
            !pid.startsWith('https://') &&
            !pid.startsWith('/')
        );

      // Supprimer les images retirées de la BDD
      await supabase.from('product_images').delete().eq('product_id', id);

      // Supprimer les visuels effectivement retirés sur Cloudinary
      if (removedPublicIds.length > 0) {
        try {
          await deleteImages(removedPublicIds);
          console.log(`Removed images deleted from Cloudinary: ${removedPublicIds.join(', ')}`);
        } catch (err) {
          console.error('Error deleting removed images from Cloudinary:', err);
        }
      }

      // Ajouter la nouvelle liste d'images dans la BDD avec les positions
      if (body.cloudinary_public_ids.length > 0) {
        const images = body.cloudinary_public_ids.map((publicId, index) => ({
          product_id: id,
          cloudinary_public_id: publicId,
          position: index,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(images);

        if (imagesError) {
          console.error('Error adding new images:', imagesError);
        }
      }
    }

    // Récupérer le produit mis à jour avec ses images
    const { data: productWithImages } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('id', id)
      .single();

    revalidatePath('/');
    revalidatePath('/boutique');
    revalidatePath('/produit/[slug]');
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return NextResponse.json(
      { product: productWithImages },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Supprimer définitivement un produit et ses photos Cloudinary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // 1. Récupérer les images associées au produit avant suppression
    const { data: images } = await supabase
      .from('product_images')
      .select('cloudinary_public_id')
      .eq('product_id', id);

    // 2. Tenter de supprimer le produit dans la base Supabase
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting product from database:', deleteError);

      // Si le produit est rattaché à des commandes (Erreur FK 23503), le désactiver
      if (deleteError.code === '23503') {
        await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', id);

        revalidatePath('/admin/products');
        return NextResponse.json(
          {
            message: 'Le produit a été désactivé pour préserver l\'historique des ventes client.',
            softDeleted: true,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Erreur lors de la suppression du produit' },
        { status: 500 }
      );
    }

    // 3. Supprimer définitivement les photos sur les serveurs Cloudinary
    if (images && images.length > 0) {
      const publicIds = images
        .map((img) => img.cloudinary_public_id)
        .filter(
          (pid) =>
            pid &&
            !pid.startsWith('http://') &&
            !pid.startsWith('https://') &&
            !pid.startsWith('/')
        );

      if (publicIds.length > 0) {
        try {
          await deleteImages(publicIds);
          console.log(`Cloudinary images successfully deleted: ${publicIds.join(', ')}`);
        } catch (cloudErr) {
          console.error('Error purging images from Cloudinary:', cloudErr);
        }
      }
    }

    revalidatePath('/');
    revalidatePath('/boutique');
    revalidatePath('/produit/[slug]');
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return NextResponse.json(
      { message: 'Produit et photos Cloudinary supprimés avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
