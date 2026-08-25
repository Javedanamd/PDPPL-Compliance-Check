import { useState } from 'react'
import type { Answer, AnswersMap, Control, DomainStats } from '../types'
import ControlCard from './ControlCard'
import RagBadge from './RagBadge'

interface Props {
  domain: string
  controls: Control[]
  answers: AnswersMap
  stats: DomainStats
  onChange: (controlId: string, answer: Answer) => void
  defaultOpen?: boolean
}

export default function DomainSection({ domain, controls, answers, stats, onChange, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen)
  const answered = stats.compliant + stats.nonCompliant + stats.notApplicable

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-apple-sm ring-1 ring-black/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-black/[0.02]"
      >
        <div className="flex items-center gap-3">
          <span
            className={`grid h-6 w-6 place-items-center rounded-full transition-transform ${open ? 'rotate-90' : ''}`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 1l5 4-5 4" stroke="#86868b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">{domain}</h2>
            <p className="text-xs text-gray-500">
              {answered}/{stats.total} answered
            </p>
          </div>
        </div>
        <RagBadge
          rag={stats.rag}
          label={stats.percentage === null ? 'No data' : `${Math.round(stats.percentage * 100)}%`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-black/5 bg-[#fafafa] p-4">
          {controls.map((c) => (
            <ControlCard
              key={c.controlId}
              control={c}
              answer={answers[c.controlId] ?? { observation: '', complianceStatus: '' }}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
