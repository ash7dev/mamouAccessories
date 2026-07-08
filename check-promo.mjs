import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Checking active promotion in settings...\n')

const { data, error } = await supabase
  .from('settings')
  .select('*')
  .eq('key', 'active_promo')
  .single()

if (error) {
  console.error('Error:', error.message)
  console.log('\nNo active_promo found in settings table.')
} else {
  console.log('Found active_promo setting:')
  console.log('Key:', data.key)
  console.log('Value (raw):', data.value)

  try {
    const parsed = JSON.parse(data.value)
    console.log('\nParsed value:')
    console.log(JSON.stringify(parsed, null, 2))

    if (parsed.isActive) {
      console.log('\n✅ Promotion is ACTIVE')
      console.log('Title:', parsed.title || 'Offre du moment (default)')
      console.log('Subtitle:', parsed.subtitle || 'Profitez de nos prix doux... (default)')
      console.log('CTA Label:', parsed.ctaLabel || 'En profiter (default)')
      console.log('CTA Href:', parsed.ctaHref || '/boutique (default)')
    } else {
      console.log('\n❌ Promotion is INACTIVE (isActive: false)')
    }
  } catch (e) {
    console.error('\n❌ Error parsing JSON:', e.message)
    console.log('Value is not valid JSON')
  }
}

// Vérifier toutes les settings
console.log('\n\n--- All settings in database ---')
const { data: allSettings } = await supabase
  .from('settings')
  .select('*')

if (allSettings) {
  allSettings.forEach(s => {
    console.log(`${s.key}: ${s.value.substring(0, 100)}${s.value.length > 100 ? '...' : ''}`)
  })
}
