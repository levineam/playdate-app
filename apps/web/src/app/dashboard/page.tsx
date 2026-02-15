import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { DashboardWorkspace } from '@/components/dashboard/dashboard-workspace'
import { previewDashboardSeed } from '@/lib/dashboard-seed'
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Playdate Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Family scheduling hub for invites, availability, and upcoming playdates.
          </p>
        </header>

        <DashboardWorkspace seed={previewDashboardSeed} previewMode={isPreviewSession} />
      </main>
    </div>
  )
}
