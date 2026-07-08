import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? '✓ Present' : '✗ Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test 1: Vérifier la connexion
console.log('\n1. Testing connection...')
const { data: testData, error: testError } = await supabase
  .from('settings')
  .select('*')
  .limit(1)

if (testError) {
  console.error('Connection test failed:', testError.message)
} else {
  console.log('✓ Connection successful')
}

// Test 2: Tester l'authentification
console.log('\n2. Testing authentication...')
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'mamouadmin@gmail.com',
  password: 'Chicgirl2003',
})

if (error) {
  console.error('✗ Auth failed:', error.message)
  console.error('Error details:', JSON.stringify(error, null, 2))
} else {
  console.log('✓ Auth successful!')
  console.log('User:', data.user?.email)
}

// Test 3: Vérifier les providers disponibles
console.log('\n3. Checking auth providers...')
const { data: providers, error: provError } = await supabase.auth.getSession()
console.log('Session:', providers ? '✓ Available' : '✗ No session')
