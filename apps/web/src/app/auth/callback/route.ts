import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import { hasSupabaseAuthConfig, isPreviewAuthBypassEnabled } from '@/lib/auth-mode'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!hasSupabaseAuthConfig()) {
    if (isPreviewAuthBypassEnabled()) {
      return NextResponse.redirect(new URL('/auth/preview', requestUrl))
    }

    return NextResponse.redirect(new URL('/auth?error=auth_unavailable', requestUrl))
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth?error=auth_failed', requestUrl))
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(new URL('/auth?error=auth_failed', requestUrl))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl))
}
