import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('Synchronizing active promotion to banner...\n')

// Récupérer les promotions actives
const { data: promotions, error } = await supabase
  .from('promotions')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`Found ${promotions.length} active promotion(s)\n`)

if (promotions.length === 0) {
  console.log('❌ No active promotion found')
  process.exit(0)
}

// Prendre la première promotion active
const promo = promotions[0]

console.log('Using promotion:')
console.log('Name:', promo.name)
console.log('Type:', promo.promotion_type)
console.log('Discount:', promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value} FCFA`)
console.log('Period:', promo.start_date, 'to', promo.end_date || 'unlimited')

// Créer le texte du banner
let subtitle = ''
let title = 'PROMOTION ACTIVE'

if (promo.promotion_type === 'automatic') {
  if (promo.applies_to === 'all_products') {
    subtitle = `${promo.discount_value}% de réduction sur tous les produits`
    title = '🎉 SUPER OFFRE'
  } else if (promo.applies_to === 'specific_category') {
    subtitle = `${promo.discount_value}% de réduction sur une sélection`
    title = 'OFFRE SPÉCIALE'
  } else if (promo.applies_to === 'specific_products') {
    subtitle = `Jusqu'à ${promo.discount_value}% de réduction`
    title = 'PROMOTION'
  }
} else {
  // Code promo
  subtitle = `Utilisez le code ${promo.code} pour ${promo.discount_value}% de réduction`
  title = 'CODE PROMO'
}

const bannerData = {
  isActive: true,
  title: title,
  subtitle: subtitle,
  ctaLabel: 'Voir les offres',
  ctaHref: '/boutique'
}

// Insérer dans settings
const { error: updateError } = await supabase
  .from('settings')
  .upsert({
    key: 'active_promo',
    value: JSON.stringify(bannerData)
  }, {
    onConflict: 'key'
  })

if (updateError) {
  console.error('\n❌ Error updating banner:', updateError.message)
} else {
  console.log('\n✅ Banner updated successfully!')
  console.log('\nBanner data:')
  console.log(JSON.stringify(bannerData, null, 2))
}
