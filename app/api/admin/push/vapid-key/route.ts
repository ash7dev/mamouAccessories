import { NextResponse } from 'next/server';

const DEFAULT_VAPID_PUBLIC_KEY = 'BOKrRK5r0u-vo2j8khtfJHE-aPDLMGP8_Kh45_wYL5wG1X1P6_-AbYwCIqA7hU3GBKhZmg7WpyAOPIGr2kevb8A';

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
  return NextResponse.json({ publicKey });
}
