import type { Rag } from '../types'

const RAG_STYLES: Record<Rag, { bg: string; text: string; dot: string; label: string }> = {
  red: { bg: 'bg-google-red/10', text: 'text-google-red', dot: 'bg-google-red', label: 'Red' },
  amber: { bg: 'bg-google-yellow/15', text: 'text-[#a16207]', dot: 'bg-google-yellow', label: 'Amber' },
  green: { bg: 'bg-google-green/10', text: 'text-google-green', dot: 'bg-google-green', label: 'Green' },
  gray: { bg: 'bg-black/5', text: 'text-gray-500', dot: 'bg-google-gray', label: 'No data' },
}

export default function RagBadge({ rag, label }: { rag: Rag; label?: string }) {
  const s = RAG_STYLES[rag]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label ?? s.label}
    </span>
  )
}
