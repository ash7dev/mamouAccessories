import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { data: campaigns, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.warn('Notice: newsletter_campaigns table query status:', error.message);
      return NextResponse.json({ campaigns: [] }, { status: 200 });
    }

    return NextResponse.json({ campaigns: campaigns || [] }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error fetching campaigns:', error);
    return NextResponse.json({ campaigns: [] }, { status: 200 });
  }
}
