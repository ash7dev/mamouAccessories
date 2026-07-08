import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('Creating banner for "Ass promotion" - 30% off all products\n')

const bannerData = {
  isActive: true,
  title: '🎉 SUPER PROMO',
  subtitle: '30% de réduction sur tous les accessoires',
  ctaLabel: 'Profiter maintenant',
  ctaHref: '/boutique'
}

const { error } = await supabase
  .from('settings')
  .upsert({
    key: 'active_promo',
    value: JSON.stringify(bannerData)
  }, {
    onConflict: 'key'
  })

if (error) {
  console.error('❌ Error:', error.message)
} else {
  console.log('✅ Banner created successfully!')
  console.log('\nBanner will show:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Title: ${bannerData.title}`)
  console.log(`Subtitle: ${bannerData.subtitle}`)
  console.log(`Button: ${bannerData.ctaLabel} → ${bannerData.ctaHref}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n✨ Refresh the home page to see the banner!')
}
