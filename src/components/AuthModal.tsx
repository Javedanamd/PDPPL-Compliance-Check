import { useState } from 'react'
import { signIn, signUp } from '../lib/useAuth'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        onClose()
      } else {
        await signUp(email, password)
        setConfirmSent(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-apple-lg"
      >
        {confirmSent ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We sent a confirmation link to <span className="font-medium">{email}</span>. Click
              it, then sign in here to save your progress to the cloud.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-google-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-google-blue-dark"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'signin' ? 'Sign in to save your progress' : 'Create an account'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Save your assessment to the cloud and pick up where you left off, from any device.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-0 bg-black/[0.03] px-3 py-2 text-sm text-gray-800 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-google-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-0 bg-black/[0.03] px-3 py-2 text-sm text-gray-800 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-google-blue"
                />
              </div>

              {error && <p className="text-sm text-google-red">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-google-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-google-blue-dark disabled:opacity-50"
              >
                {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setError(null)
                }}
                className="font-medium text-google-blue hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <button
              onClick={onClose}
              className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600"
            >
              Continue without saving
            </button>
          </>
        )}
      </div>
    </div>
  )
}
