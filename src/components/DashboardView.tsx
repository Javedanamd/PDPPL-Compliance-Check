import { useRef, useState } from 'react'
import type { DomainStats, OverallStats } from '../types'
import SummaryCards from './SummaryCards'
import DomainBarChart from './DomainBarChart'
import OverallPieChart from './OverallPieChart'
import DomainRagList from './DomainRagList'
import { exportElementAsPdf } from '../lib/exportImage'

interface Props {
  overall: OverallStats
  domainStats: DomainStats[]
  signedIn: boolean
  onRequireSignIn: () => void
}

export default function DashboardView({ overall, domainStats, signedIn, onRequireSignIn }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    if (!signedIn) {
      onRequireSignIn()
      return
    }
    if (!ref.current) return
    setBusy(true)
    try {
      await exportElementAsPdf(ref.current)
    } catch (err) {
      console.error(err)
      alert('Could not export the dashboard as PDF. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Compliance Dashboard</h1>
        <button
          onClick={handleExport}
          disabled={busy}
          title={signedIn ? undefined : 'Sign in to download'}
          className="rounded-xl bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-apple-sm transition hover:bg-google-blue-dark disabled:opacity-50"
        >
          {busy ? 'Exporting…' : signedIn ? 'Download PDF' : 'Sign in to download PDF'}
        </button>
      </div>

      <div ref={ref} className="space-y-4 rounded-3xl bg-[#f5f5f7] p-1">
        <SummaryCards overall={overall} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DomainBarChart data={domainStats} />
          <OverallPieChart overall={overall} />
        </div>
        <DomainRagList data={domainStats} />
      </div>
    </div>
  )
}
