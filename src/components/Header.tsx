import { useRef } from 'react'

export type Tab = 'assessment' | 'dashboard' | 'roadmap'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error'

const TABS: { id: Tab; label: string }[] = [
  { id: 'assessment', label: 'Assessment' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'roadmap', label: 'Roadmap' },
]

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved to your account',
  unsaved: 'Unsaved changes',
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
  autosaveEnabled: boolean
  onToggleAutosave: () => void
  onManualSave: () => void
  canManualSave: boolean
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
  autosaveEnabled,
  onToggleAutosave,
  onManualSave,
  canManualSave,
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
                <button
                  onClick={onToggleAutosave}
                  role="switch"
                  aria-checked={autosaveEnabled}
                  title={autosaveEnabled ? 'Autosave is on' : 'Autosave is off'}
                  className="flex items-center gap-1.5 rounded-xl bg-black/5 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-black/10"
                >
                  <span
                    className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                      autosaveEnabled ? 'bg-google-green' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                        autosaveEnabled ? 'translate-x-3.5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                  Autosave
                </button>
                {!autosaveEnabled && (
                  <button
                    onClick={onManualSave}
                    disabled={!canManualSave}
                    title={canManualSave ? 'Save now' : 'Nothing to save'}
                    aria-label="Save now"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-google-blue text-white transition hover:bg-google-blue-dark disabled:cursor-default disabled:bg-black/5 disabled:text-gray-300"
                  >
                    <SaveIcon />
                  </button>
                )}
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

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 2.5h8l2.5 2.5V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M5 2.5v3.5h5v-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 9.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
