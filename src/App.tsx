import { useEffect, useMemo, useState } from 'react'
import type { Answer, AnswersMap, RoadmapEdit, RoadmapEditsMap } from './types'
import { CONTROLS } from './data/controls'
import { computeDomainStats, computeOverallStats } from './lib/aggregate'
import { generateRoadmap } from './lib/roadmap'
import { loadAnswers, loadRoadmapEdits, saveAnswers, saveRoadmapEdits, clearAll } from './lib/storage'
import { exportAssessmentToExcel, importAssessmentFromExcel } from './lib/excel'
import Header, { type Tab } from './components/Header'
import AssessmentView from './components/AssessmentView'
import DashboardView from './components/DashboardView'
import RoadmapView from './components/RoadmapView'

export default function App() {
  const [tab, setTab] = useState<Tab>('assessment')
  const [answers, setAnswers] = useState<AnswersMap>(() => loadAnswers())
  const [roadmapEdits, setRoadmapEdits] = useState<RoadmapEditsMap>(() => loadRoadmapEdits())

  useEffect(() => saveAnswers(answers), [answers])
  useEffect(() => saveRoadmapEdits(roadmapEdits), [roadmapEdits])

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
      />

      <main className="pt-6">
        {tab === 'assessment' && (
          <AssessmentView answers={answers} domainStats={domainStats} onChange={handleAnswerChange} />
        )}
        {tab === 'dashboard' && <DashboardView overall={overall} domainStats={domainStats} />}
        {tab === 'roadmap' && <RoadmapView items={roadmap} onEdit={handleRoadmapEdit} />}
      </main>
    </div>
  )
}
