import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Configurarion Cloudinary côté serveur
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Convertir le fichier File en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Essayer l'upload Cloudinary via SDK serveur si configuré
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        return NextResponse.json({
          success: true,
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          provider: 'cloudinary',
        });
      } catch (cloudinaryError) {
        console.error('Erreur upload serveur Cloudinary:', cloudinaryError);
        // Continuer vers le fallback Supabase
      }
    }

    // 2. Fallback Supabase Storage
    try {
      const supabase = createServiceRoleClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(data.path);

        return NextResponse.json({
          success: true,
          public_id: publicUrlData.publicUrl,
          url: publicUrlData.publicUrl,
          provider: 'supabase',
        });
      }
    } catch (supabaseError) {
      console.error('Erreur upload fallback Supabase:', supabaseError);
    }

    return NextResponse.json(
      { error: "Impossible d'uploader l'image. Vérifiez la configuration du stockage." },
      { status: 500 }
    );
  } catch (error) {
    console.error('Erreur inattendue API /api/upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
