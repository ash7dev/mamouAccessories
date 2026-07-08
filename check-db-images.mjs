import { createClient } from '@supabase/supabase-js';

// Utiliser les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'set' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseImages() {
  console.log('=== Vérification des images dans la base de données ===\n');

  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, product_id, cloudinary_public_id, position')
    .order('position')
    .limit(5);

  if (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return;
  }

  console.log(`Trouvé ${images.length} images:\n`);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
  console.log(`Cloudinary Cloud Name: ${cloudName}\n`);

  images.forEach((img, index) => {
    console.log(`${index + 1}. Image ID: ${img.id}`);
    console.log(`   Product ID: ${img.product_id}`);
    console.log(`   Cloudinary Public ID (brut): "${img.cloudinary_public_id}"`);
    
    // Tester différentes constructions d'URL
    const url1 = `https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}`;
    const url2 = `https://res.cloudinary.com/${cloudName}/image/upload/products/${img.cloudinary_public_id}`;
    
    console.log(`   URL 1 (direct): ${url1}`);
    console.log(`   URL 2 (avec products/): ${url2}`);
    console.log('');
  });

  // Vérifier aussi les produits
  console.log('\n=== Vérification des produits ===\n');
  
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, is_active')
    .limit(3);

  if (productsError) {
    console.error('Erreur lors de la récupération des produits:', productsError);
    return;
  }

  console.log(`Trouvé ${products.length} produits:\n`);

  for (const product of products) {
    console.log(`Produit: ${product.name} (ID: ${product.id})`);
    
    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select('cloudinary_public_id, position')
      .eq('product_id', product.id)
      .order('position');

    if (imagesError) {
      console.error('  Erreur images:', imagesError);
    } else if (productImages && productImages.length > 0) {
      console.log(`  Images (${productImages.length}):`);
      productImages.forEach((img, i) => {
        console.log(`    ${i + 1}. "${img.cloudinary_public_id}" (position: ${img.position})`);
      });
    } else {
      console.log('  Aucune image');
    }
    console.log('');
  }
}

checkDatabaseImages();
