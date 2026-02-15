import { NextRequest, NextResponse } from 'next/server'

import {
  PREVIEW_AUTH_COOKIE_NAME,
  PREVIEW_AUTH_COOKIE_VALUE,
  isPreviewAuthBypassEnabled,
} from '@/lib/auth-mode'

function redirectTo(pathname: string) {
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: pathname,
    },
  })
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  if (!isPreviewAuthBypassEnabled()) {
    return redirectTo('/auth?error=preview_mode_unavailable')
  }

  const response = redirectTo('/dashboard?mode=preview')
  response.cookies.set({
    name: PREVIEW_AUTH_COOKIE_NAME,
    value: PREVIEW_AUTH_COOKIE_VALUE,
    httpOnly: true,
    sameSite: 'lax',
    secure: requestUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return response
}
