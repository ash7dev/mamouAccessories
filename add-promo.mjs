import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('Adding active promotion to settings...\n')

const promoData = {
  isActive: true,
  title: "NOUVELLE COLLECTION",
  subtitle: "Découvrez nos derniers accessoires premium",
  ctaLabel: "Découvrir",
  ctaHref: "/boutique"
}

const { data, error } = await supabase
  .from('settings')
  .upsert({
    key: 'active_promo',
    value: JSON.stringify(promoData)
  }, {
    onConflict: 'key'
  })

if (error) {
  console.error('❌ Error:', error.message)
} else {
  console.log('✅ Promotion added successfully!')
  console.log('\nPromotion details:')
  console.log(JSON.stringify(promoData, null, 2))
}

// Vérifier
console.log('\n\nVerifying...')
const { data: check } = await supabase
  .from('settings')
  .select('*')
  .eq('key', 'active_promo')
  .single()

if (check) {
  console.log('✅ Confirmed in database:')
  console.log('Key:', check.key)
  console.log('Value:', check.value)
}
