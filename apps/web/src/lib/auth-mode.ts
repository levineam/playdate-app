const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_SUPABASE_ANON_KEY = 'placeholder-key'

export const PREVIEW_AUTH_COOKIE_NAME = 'playdate_preview_mode'
export const PREVIEW_AUTH_COOKIE_VALUE = 'enabled'

function isVercelProductionRuntime(env: NodeJS.ProcessEnv = process.env) {
  return env.VERCEL_ENV === 'production'
}

function isVercelPreviewRuntime(env: NodeJS.ProcessEnv = process.env) {
  return env.VERCEL_ENV === 'preview'
}

function isNonVercelRuntime(env: NodeJS.ProcessEnv = process.env) {
  return !env.VERCEL_ENV
}

export function hasSupabaseAuthConfig(env: NodeJS.ProcessEnv = process.env) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== PLACEHOLDER_SUPABASE_URL &&
      supabaseAnonKey !== PLACEHOLDER_SUPABASE_ANON_KEY
  )
}

export function isPreviewAuthBypassEnabled(env: NodeJS.ProcessEnv = process.env) {
  if (hasSupabaseAuthConfig(env) || isVercelProductionRuntime(env)) {
    return false
  }

  const hasExplicitPreviewFlag =
    env.NEXT_PUBLIC_ENABLE_PREVIEW_AUTH_BYPASS === 'true' ||
    env.ENABLE_PREVIEW_AUTH_BYPASS === 'true'

  if (hasExplicitPreviewFlag) {
    return true
  }

  return isVercelPreviewRuntime(env) || isNonVercelRuntime(env)
}
