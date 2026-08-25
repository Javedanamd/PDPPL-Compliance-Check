import { useState } from 'react'
import type { RoadmapEdit, RoadmapItem, RoadmapStatus } from '../types'
import { ROADMAP_STATUS_OPTIONS } from '../types'

const STATUS_DOT: Record<RoadmapStatus, string> = {
  'Yet to Start': 'bg-google-red',
  'In Progress': 'bg-google-yellow',
  Completed: 'bg-google-green',
}

interface Props {
  item: RoadmapItem
  onEdit: (controlId: string, edit: RoadmapEdit) => void
  defaultOpen?: boolean
}

export default function RoadmapItemCard({ item, onEdit, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-apple-sm ring-1 ring-black/5">
      <div
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
        className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-transform ${open ? 'rotate-90' : ''}`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 1l5 4-5 4" stroke="#86868b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-google-blue/10 px-2 py-0.5 text-xs font-semibold text-google-blue">
                {item.controlId}
              </span>
              <span className="text-xs text-gray-400">{item.domain}</span>
            </div>
            <h3 className="mt-1.5 truncate text-[15px] font-semibold text-gray-900">{item.controlTitle}</h3>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={item.status}
            onChange={(e) => onEdit(item.controlId, { status: e.target.value as RoadmapStatus })}
            className="min-w-[150px] rounded-xl border-0 bg-black/5 px-3 py-2 text-sm font-medium text-gray-800 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-google-blue"
          >
            {ROADMAP_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-[#fafafa] px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Implementation Steps"
              value={item.implementationSteps}
              onChange={(v) => onEdit(item.controlId, { implementationSteps: v })}
            />
            <Field
              label="Responsible Stakeholder"
              value={item.responsibleStakeholder}
              onChange={(v) => onEdit(item.controlId, { responsibleStakeholder: v })}
            />
            <Field
              label="Priority"
              value={item.priority}
              onChange={(v) => onEdit(item.controlId, { priority: v })}
            />
            <Field
              label="Timeline"
              value={item.timeline}
              onChange={(v) => onEdit(item.controlId, { timeline: v })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-google-blue"
      />
    </div>
  )
}
