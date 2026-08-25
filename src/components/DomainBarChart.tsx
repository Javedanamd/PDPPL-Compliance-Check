import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DomainStats } from '../types'

const ABBR: Record<string, string> = {
  'Privacy Governance': 'PG',
  Transparency: 'TR',
  'Permitted Reasons': 'PR',
  'Special Nature Processing': 'SNP',
  'Data Lifecycle Management': 'DLM',
  "Individuals' Rights": 'IR',
  'Personal Data Breach Management': 'PDBM',
  'Disclosure to Third Parties': 'DTP',
  'Direct Marketing': 'DM',
  'Privacy by Design': 'PBD',
  'Security for Privacy': 'SP',
  'Continuous Compliance': 'CC',
}

export default function DomainBarChart({ data }: { data: DomainStats[] }) {
  const chartData = data.map((d) => ({
    name: ABBR[d.domain] ?? d.domain,
    fullName: d.domain,
    Compliant: d.compliant,
    'Non Compliant': d.nonCompliant,
    'Not Applicable': d.notApplicable,
  }))

  return (
    <div className="rounded-2xl bg-white p-5 shadow-apple-sm ring-1 ring-black/5">
      <h3 className="text-sm font-semibold text-gray-900">Compliance status across domains</h3>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef1" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Compliant" stackId="a" fill="#34a853" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Non Compliant" stackId="a" fill="#ea4335" />
            <Bar dataKey="Not Applicable" stackId="a" fill="#9aa0a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
