'use client'

import { useState } from 'react'

// Force dynamic rendering to avoid build-time Supabase initialization issues
export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSupabaseConfigured) {
      toast.error('Authentication is not configured. Please contact support.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error('Error sending magic link: ' + error.message)
      } else {
        toast.success('Magic link sent! Check your email.')
        setEmail('')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Playdate</CardTitle>
          <CardDescription>
            Sign in to coordinate playdates with your children&rsquo;s friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className={`w-full ${!isSupabaseConfigured ? 'disabled:opacity-100' : ''}`}
              disabled={isLoading || !email || !isSupabaseConfigured}
              aria-describedby={!isSupabaseConfigured ? 'auth-config-note' : undefined}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
          {!isSupabaseConfigured && (
            <p id="auth-config-note" className="mt-3 text-sm text-amber-700 text-center" role="status">
              Magic-link sign-in is temporarily unavailable in this preview environment.
            </p>
          )}
          <p className="mt-4 text-sm text-gray-600 text-center">
            We&rsquo;ll send you a secure link to sign in. No passwords needed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}