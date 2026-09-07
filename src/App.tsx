import { useEffect, useMemo, useRef, useState } from 'react'
import type { Answer, AnswersMap, RoadmapEdit, RoadmapEditsMap } from './types'
import { CONTROLS } from './data/controls'
import { computeDomainStats, computeOverallStats } from './lib/aggregate'
import { generateRoadmap } from './lib/roadmap'
import { loadAnswers, loadRoadmapEdits, saveAnswers, saveRoadmapEdits, clearAll } from './lib/storage'
import { exportAssessmentToExcel, importAssessmentFromExcel } from './lib/excel'
import { loadCloudAssessment, saveCloudAssessment } from './lib/cloudStore'
import { isSupabaseConfigured } from './lib/supabaseClient'
import { signOut, useAuth } from './lib/useAuth'
import Header, { type SaveStatus, type Tab } from './components/Header'
import AssessmentView from './components/AssessmentView'
import DashboardView from './components/DashboardView'
import RoadmapView from './components/RoadmapView'
import AuthModal from './components/AuthModal'

const SAVE_DEBOUNCE_MS = 1200

export default function App() {
  const [tab, setTab] = useState<Tab>('assessment')
  const [answers, setAnswers] = useState<AnswersMap>(() => loadAnswers())
  const [roadmapEdits, setRoadmapEdits] = useState<RoadmapEditsMap>(() => loadRoadmapEdits())

  const { session } = useAuth()
  const userId = session?.user.id ?? null
  const userEmail = session?.user.email ?? null

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const syncingRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loadedForUserRef = useRef<string | null>(null)

  useEffect(() => saveAnswers(answers), [answers])
  useEffect(() => saveRoadmapEdits(roadmapEdits), [roadmapEdits])

  // When a user signs in, load their saved cloud assessment (or, if this is
  // their first time saving, adopt whatever's currently in local storage).
  useEffect(() => {
    if (!userId || loadedForUserRef.current === userId) return
    loadedForUserRef.current = userId
    syncingRef.current = true
    loadCloudAssessment(userId)
      .then(async (cloud) => {
        if (cloud) {
          setAnswers(cloud.answers)
          setRoadmapEdits(cloud.roadmapEdits)
        } else {
          await saveCloudAssessment(userId, answers, roadmapEdits)
        }
        setSaveStatus('saved')
      })
      .catch(() => setSaveStatus('error'))
      .finally(() => {
        syncingRef.current = false
      })
    // Only re-run when the signed-in user changes -- intentionally reads the
    // in-memory answers/roadmapEdits at that moment, not on every edit.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (!userId) {
      loadedForUserRef.current = null
      setSaveStatus('idle')
    }
  }, [userId])

  // Debounced autosave to Supabase whenever answers/roadmap edits change,
  // as long as we're not mid-way through loading a freshly signed-in user.
  useEffect(() => {
    if (!userId || syncingRef.current) return
    setSaveStatus('saving')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveCloudAssessment(userId, answers, roadmapEdits)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'))
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [answers, roadmapEdits, userId])

  const domainStats = useMemo(() => computeDomainStats(answers), [answers])
  const overall = useMemo(() => computeOverallStats(domainStats), [domainStats])
  const roadmap = useMemo(() => generateRoadmap(answers, roadmapEdits), [answers, roadmapEdits])

  const answeredCount = overall.compliant + overall.nonCompliant + overall.notApplicable

  function handleAnswerChange(controlId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [controlId]: answer }))
  }

  function handleRoadmapEdit(controlId: string, edit: RoadmapEdit) {
    setRoadmapEdits((prev) => ({ ...prev, [controlId]: { ...prev[controlId], ...edit } }))
  }

  async function handleImport(file: File) {
    try {
      const imported = await importAssessmentFromExcel(file)
      setAnswers((prev) => ({ ...prev, ...imported }))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not import this file.')
    }
  }

  function handleReset() {
    if (!confirm('Clear all assessment answers and roadmap edits? This cannot be undone.')) return
    clearAll()
    setAnswers({})
    setRoadmapEdits({})
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header
        tab={tab}
        onTabChange={setTab}
        onExport={() => exportAssessmentToExcel(answers)}
        onImport={handleImport}
        onReset={handleReset}
        answeredCount={answeredCount}
        totalCount={CONTROLS.length}
        userEmail={userEmail}
        saveStatus={saveStatus}
        onSignInClick={() => setShowAuthModal(true)}
        onSignOutClick={() => signOut()}
      />

      {!isSupabaseConfigured && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-xl bg-google-yellow/15 px-4 py-2 text-xs font-medium text-[#a16207]">
            Cloud save isn't configured yet — progress is only stored in this browser. Set
            VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable saving to an account.
          </div>
        </div>
      )}

      <main className="pt-6">
        {tab === 'assessment' && (
          <AssessmentView answers={answers} domainStats={domainStats} onChange={handleAnswerChange} />
        )}
        {tab === 'dashboard' && <DashboardView overall={overall} domainStats={domainStats} />}
        {tab === 'roadmap' && <RoadmapView items={roadmap} onEdit={handleRoadmapEdit} />}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
