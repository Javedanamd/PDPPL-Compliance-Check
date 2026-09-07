import { useRef } from 'react'

export type Tab = 'assessment' | 'dashboard' | 'roadmap'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const TABS: { id: Tab; label: string }[] = [
  { id: 'assessment', label: 'Assessment' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'roadmap', label: 'Roadmap' },
]

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved to your account',
  error: 'Could not save — check connection',
}

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
  onExport: () => void
  onImport: (file: File) => void
  onReset: () => void
  answeredCount: number
  totalCount: number
  userEmail: string | null
  saveStatus: SaveStatus
  onSignInClick: () => void
  onSignOutClick: () => void
}

export default function Header({
  tab,
  onTabChange,
  onExport,
  onImport,
  onReset,
  answeredCount,
  totalCount,
  userEmail,
  saveStatus,
  onSignInClick,
  onSignOutClick,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const signedIn = !!userEmail

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-gray-900">
              PDPPL Compliance Assessment
            </h1>
            <p className="text-xs text-gray-400">
              {answeredCount}/{totalCount} controls answered
              {userEmail && saveStatus !== 'idle' && (
                <span className={saveStatus === 'error' ? 'text-google-red' : ''}>
                  {' '}
                  · {SAVE_STATUS_LABEL[saveStatus]}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onImport(f)
                e.target.value = ''
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-xl bg-black/5 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-black/10"
            >
              Import Excel
            </button>
            <button
              onClick={signedIn ? onExport : onSignInClick}
              title={signedIn ? undefined : 'Sign in to export'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-black/10"
            >
              Export Excel
              {!signedIn && <LockIcon />}
            </button>
            <button
              onClick={onReset}
              className="rounded-xl px-3.5 py-2 text-sm font-medium text-google-red transition hover:bg-google-red/10"
            >
              Reset
            </button>

            <span className="mx-1 h-5 w-px bg-black/10" />

            {userEmail ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-gray-600 sm:inline">{userEmail}</span>
                <button
                  onClick={onSignOutClick}
                  className="rounded-xl bg-black/5 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-black/10"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="rounded-xl bg-google-blue px-3.5 py-2 text-sm font-medium text-white transition hover:bg-google-blue-dark"
              >
                Sign in to save
              </button>
            )}
          </div>
        </div>

        <nav className="mt-3 flex gap-1 rounded-xl bg-black/5 p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === t.id ? 'bg-white text-gray-900 shadow-apple-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
