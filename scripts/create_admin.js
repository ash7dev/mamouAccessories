#!/usr/bin/env node
/*
 Create or update an admin user in Supabase using the service role key.
 Usage:
   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create_admin.js email@example.com password123
 If no args provided, you will be prompted interactively.
 Security: run this locally and do not commit your `SUPABASE_SERVICE_ROLE_KEY`.
*/
const readline = require('readline');

const [, , emailArg, passwordArg] = process.argv;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

async function promptIfNeeded(email, password) {
  if (email && password) return { email, password };
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise((res) => rl.question(q, res));
  try {
    email = email || (await question('Email for admin user: '));
    password = password || (await question('Password for admin user: '));
  } finally {
    rl.close();
  }
  return { email, password };
}

(async () => {
  const { email, password } = await promptIfNeeded(emailArg, passwordArg);
  if (!email || !password) {
    console.error('Email and password are required.');
    process.exit(2);
  }

  const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users`;
  const body = { email: email.trim(), password: password.trim(), email_confirm: true };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('HTTP', res.status);
    try { console.log(JSON.stringify(JSON.parse(text), null, 2)); } catch (e) { console.log(text); }
    if (!res.ok) process.exit(3);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(4);
  }
})();
