import { useRef, useState } from 'react'
import type { DomainStats, OverallStats } from '../types'
import SummaryCards from './SummaryCards'
import DomainBarChart from './DomainBarChart'
import OverallPieChart from './OverallPieChart'
import DomainRagList from './DomainRagList'
import { exportElementAsPdf, exportElementAsPng } from '../lib/exportImage'

interface Props {
  overall: OverallStats
  domainStats: DomainStats[]
}

export default function DashboardView({ overall, domainStats }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null)

  async function handleExport(kind: 'png' | 'pdf') {
    if (!ref.current) return
    setBusy(kind)
    try {
      if (kind === 'png') await exportElementAsPng(ref.current)
      else await exportElementAsPdf(ref.current)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Compliance Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('png')}
            disabled={busy !== null}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-apple-sm ring-1 ring-black/5 transition hover:bg-black/[0.03] disabled:opacity-50"
          >
            {busy === 'png' ? 'Exporting…' : 'Download PNG'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={busy !== null}
            className="rounded-xl bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-apple-sm transition hover:bg-google-blue-dark disabled:opacity-50"
          >
            {busy === 'pdf' ? 'Exporting…' : 'Download PDF'}
          </button>
        </div>
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
