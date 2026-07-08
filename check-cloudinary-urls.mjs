import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCloudinaryIds() {
  console.log('Checking Cloudinary public IDs in database...\n');

  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, product_id, cloudinary_public_id, position')
    .order('position')
    .limit(10);

  if (error) {
    console.error('Error fetching images:', error);
    return;
  }

  console.log(`Found ${images.length} images:\n`);

  images.forEach((img, index) => {
    console.log(`${index + 1}. ID: ${img.id}`);
    console.log(`   Product ID: ${img.product_id}`);
    console.log(`   Cloudinary Public ID: "${img.cloudinary_public_id}"`);
    console.log(`   Position: ${img.position}`);
    
    // Build URL the current way
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
    const currentUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}`;
    console.log(`   Current URL: ${currentUrl}`);
    
    // Try with f_auto,q_auto
    const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${img.cloudinary_public_id}`;
    console.log(`   Optimized URL: ${optimizedUrl}`);
    
    console.log('');
  });
}

checkCloudinaryIds();
