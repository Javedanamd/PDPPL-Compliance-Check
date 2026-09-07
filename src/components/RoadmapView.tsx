import { useMemo, useState } from 'react'
import type { RoadmapEdit, RoadmapItem } from '../types'
import { ROADMAP_STATUS_OPTIONS } from '../types'
import { exportRoadmapToExcel } from '../lib/excel'
import RoadmapItemCard from './RoadmapItemCard'

interface Props {
  items: RoadmapItem[]
  onEdit: (controlId: string, edit: RoadmapEdit) => void
  signedIn: boolean
  onRequireSignIn: () => void
}

export default function RoadmapView({ items, onEdit, signedIn, onRequireSignIn }: Props) {
  const [domainFilter, setDomainFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const domains = useMemo(
    () => Array.from(new Set(items.map((i) => i.domain))).sort(),
    [items],
  )

  const filtered = items.filter(
    (i) =>
      (domainFilter === 'all' || i.domain === domainFilter) &&
      (statusFilter === 'all' || i.status === statusFilter),
  )

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Implementation Roadmap</h1>
          <p className="text-sm text-gray-500">
            Auto-generated from every control marked <span className="font-medium text-google-red">Non Compliant</span> in the assessment.
          </p>
        </div>
        <button
          onClick={() => (signedIn ? exportRoadmapToExcel(items) : onRequireSignIn())}
          disabled={items.length === 0}
          title={signedIn ? undefined : 'Sign in to download'}
          className="rounded-xl bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-apple-sm transition hover:bg-google-blue-dark disabled:opacity-40"
        >
          {signedIn ? 'Download Roadmap (Excel)' : 'Sign in to download Roadmap'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-400 shadow-apple-sm ring-1 ring-black/5">
          No non-compliant controls yet — the roadmap fills in automatically as you complete the assessment.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-700 shadow-apple-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-google-blue"
            >
              <option value="all">All domains</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-700 shadow-apple-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-google-blue"
            >
              <option value="all">All statuses</option>
              {ROADMAP_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filtered.map((item) => (
              <RoadmapItemCard key={item.controlId} item={item} onEdit={onEdit} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
