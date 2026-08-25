import type { DomainStats } from '../types'
import RagBadge from './RagBadge'

const RAG_ORDER = { red: 0, amber: 1, gray: 2, green: 3 }

export default function DomainRagList({ data }: { data: DomainStats[] }) {
  const sorted = [...data].sort((a, b) => RAG_ORDER[a.rag] - RAG_ORDER[b.rag])

  return (
    <div className="rounded-2xl bg-white p-5 shadow-apple-sm ring-1 ring-black/5">
      <h3 className="text-sm font-semibold text-gray-900">Domain breakdown</h3>
      <div className="mt-3 divide-y divide-black/5">
        {sorted.map((d) => (
          <div key={d.domain} className="flex items-center justify-between gap-4 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{d.domain}</p>
              <p className="text-xs text-gray-400">
                {d.compliant} compliant · {d.nonCompliant} non compliant · {d.notApplicable} N/A
              </p>
            </div>
            <RagBadge
              rag={d.rag}
              label={d.percentage === null ? 'No data' : `${Math.round(d.percentage * 100)}%`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
