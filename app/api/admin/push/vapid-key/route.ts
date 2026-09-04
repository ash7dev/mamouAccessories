import { NextResponse } from 'next/server';

const DEFAULT_VAPID_PUBLIC_KEY = 'BAW4Ln6fItQzCGRFFxhPu3SuyLy8h2-F3H3u0PhYB4CaT9Q_TnQLTuLAfio3Uh7YygTOfytXVlAoI3IZZ5haWTA';

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
  return NextResponse.json({ publicKey });
}
