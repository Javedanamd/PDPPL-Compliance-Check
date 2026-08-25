import { useState } from 'react'
import type { Answer, Control } from '../types'
import { COMPLIANCE_STATUS_OPTIONS } from '../types'

const STATUS_RING: Record<string, string> = {
  Compliant: 'ring-google-green/40 bg-google-green/5',
  'Non Compliant': 'ring-google-red/40 bg-google-red/5',
  'Not Applicable': 'ring-google-gray/40 bg-black/[0.02]',
  '': 'ring-black/5',
}

const STATUS_DOT: Record<string, string> = {
  Compliant: 'bg-google-green',
  'Non Compliant': 'bg-google-red',
  'Not Applicable': 'bg-google-gray',
  '': 'bg-gray-300',
}

interface Props {
  control: Control
  answer: Answer
  onChange: (controlId: string, answer: Answer) => void
  defaultOpen?: boolean
}

export default function ControlCard({ control, answer, onChange, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen)
  const status = answer.complianceStatus ?? ''
  const ring = STATUS_RING[status] ?? STATUS_RING['']
  const dot = STATUS_DOT[status] ?? STATUS_DOT['']

  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-apple-sm ring-1 transition-colors ${ring}`}>
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
          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-google-blue/10 px-2 py-0.5 text-xs font-semibold text-google-blue">
                {control.controlId}
              </span>
              <span className="rounded-md bg-black/5 px-2 py-0.5 text-xs font-medium text-gray-500">
                {control.controlType}
              </span>
            </div>
            <h3 className="mt-1.5 truncate text-[15px] font-semibold text-gray-900">{control.controlTitle}</h3>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            onChange={(e) =>
              onChange(control.controlId, {
                ...answer,
                complianceStatus: e.target.value as Answer['complianceStatus'],
              })
            }
            className="min-w-[160px] rounded-xl border-0 bg-black/5 px-3 py-2 text-sm font-medium text-gray-800 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-google-blue"
          >
            <option value="">Not answered</option>
            {COMPLIANCE_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-[#fafafa] px-5 py-4">
          <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
            {control.controlDescription}
          </p>

          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-gray-500 sm:grid-cols-3">
            <div>
              <span className="font-medium text-gray-700">Law reference: </span>
              {control.lawReference || 'NA'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Guidelines: </span>
              {control.guidelinesReference || 'NA'}
            </div>
            <div>
              <span className="font-medium text-gray-700">Penalties: </span>
              {control.penalties || 'NA'}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Observation</label>
            <textarea
              value={answer.observation}
              onChange={(e) => onChange(control.controlId, { ...answer, observation: e.target.value })}
              placeholder="Notes substantiating this control's compliance status..."
              rows={2}
              className="w-full resize-y rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-1 ring-black/5 transition placeholder:text-gray-400 focus:ring-2 focus:ring-google-blue"
            />
          </div>
        </div>
      )}
    </div>
  )
}
