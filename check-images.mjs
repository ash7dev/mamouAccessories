import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Checking product images in database...\n')

const { data: images, error } = await supabase
  .from('product_images')
  .select('id, product_id, cloudinary_public_id, position')
  .order('position')
  .limit(10)

if (error) {
  console.error('Error:', error.message)
} else {
  console.log('First 10 images:')
  images.forEach(img => {
    console.log(`\nProduct ID: ${img.product_id}`)
    console.log(`Public ID: ${img.cloudinary_public_id}`)
    console.log(`Full URL: https://res.cloudinary.com/utngoden/image/upload/${img.cloudinary_public_id}`)
  })
}
