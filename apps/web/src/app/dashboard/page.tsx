import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  PREVIEW_AUTH_COOKIE_NAME,
  PREVIEW_AUTH_COOKIE_VALUE,
  hasSupabaseAuthConfig,
  isPreviewAuthBypassEnabled,
} from '@/lib/auth-mode'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const hasSupabaseAuth = hasSupabaseAuthConfig()
  const previewBypassEnabled = isPreviewAuthBypassEnabled()

  if (!hasSupabaseAuth && !previewBypassEnabled) {
    redirect('/auth?error=auth_unavailable')
  }

  const cookieStore = await cookies()
  const hasPreviewCookie =
    cookieStore.get(PREVIEW_AUTH_COOKIE_NAME)?.value === PREVIEW_AUTH_COOKIE_VALUE

  const isPreviewSession = !hasSupabaseAuth && previewBypassEnabled

  if (isPreviewSession && !hasPreviewCookie) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>

        {isPreviewSession ? (
          <div data-testid="preview-mode-banner" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <p className="font-medium">Preview mode active</p>
            <p className="mt-1 text-sm">
              You&rsquo;re bypassing sign-in because auth is unavailable in this preview build.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-zinc-700 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200">
            <p className="font-medium">Signed-in experience</p>
            <p className="mt-1 text-sm">Auth is configured for this deployment.</p>
          </div>
        )}

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Temporary dashboard placeholder for the preview-auth rollout.
        </p>

        <Link
          href="/"
          className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-white/20 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Back to home
        </Link>
      </main>
    </div>
  )
}
