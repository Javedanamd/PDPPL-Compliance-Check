import type { OverallStats } from '../types'
import RagBadge from './RagBadge'

interface Props {
  overall: OverallStats
}

export default function SummaryCards({ overall }: Props) {
  const cards = [
    { label: 'Compliant', value: overall.compliant, color: 'text-google-green' },
    { label: 'Non Compliant', value: overall.nonCompliant, color: 'text-google-red' },
    { label: 'Not Applicable', value: overall.notApplicable, color: 'text-google-gray' },
    {
      label: 'Unanswered',
      value: overall.total - overall.compliant - overall.nonCompliant - overall.notApplicable,
      color: 'text-gray-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="col-span-2 rounded-2xl bg-white p-5 shadow-apple-sm ring-1 ring-black/5 sm:col-span-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Overall compliance</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-gray-900">
              {overall.percentage === null ? '—' : `${Math.round(overall.percentage * 100)}%`}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Based on {overall.applicable} applicable of {overall.total} controls
            </p>
          </div>
          <RagBadge rag={overall.rag} />
        </div>
      </div>
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-white p-4 shadow-apple-sm ring-1 ring-black/5">
          <p className="text-xs font-medium text-gray-500">{c.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}
