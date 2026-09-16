import { NextResponse } from 'next/server';

const DEFAULT_VAPID_PUBLIC_KEY = 'BBqd6GqjHdmN2XlrVEwvpMIXTSkP2BGzGspc6Rv01O2I1zjgVVzzMQZDwnUDmShGxpp0DJz7OSGwDjIo36tOpN4';

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
  return NextResponse.json({ publicKey });
}
