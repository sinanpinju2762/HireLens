import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session ?? null
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    }).catch(() => setLoading(false))

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(uid) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // Create profile row
    await supabase.from('profiles').insert({
      id:    data.user.id,
      name,
      email,
      total_interviews: 0,
      total_resumes:    0,
      avg_score:        0,
    })
    return data.user
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
  }

  async function signInWithLinkedIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  // Refresh profile from Supabase
  async function refreshProfile() {
    if (!user) return
    await fetchProfile(user.id)
  }

  const displayName  = profile?.name || user?.email || ''
  const initials     = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const firstName    = displayName.split(' ')[0] || 'there'

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUp, signIn, signOut, signInWithGoogle, signInWithLinkedIn, resetPassword, refreshProfile,
      displayName, initials, firstName,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
