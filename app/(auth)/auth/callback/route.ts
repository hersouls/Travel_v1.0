import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/travels';

  if (code) {
    const supabase = createRouteHandlerSupabaseClient();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ OAuth callback error:', error);
        return NextResponse.redirect(
          `${origin}/signin?error=OAuth authentication failed`
        );
      }

      // 성공적으로 인증된 경우 travels 페이지로 리디렉션
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error('❌ OAuth callback exception:', error);
      return NextResponse.redirect(
        `${origin}/signin?error=Authentication failed`
      );
    }
  }

  // 코드가 없는 경우 로그인 페이지로 리디렉션
  return NextResponse.redirect(`${origin}/signin?error=No authorization code`);
}