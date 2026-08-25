import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { OverallStats } from '../types'

const COLORS: Record<string, string> = {
  Compliant: '#34a853',
  'Non Compliant': '#ea4335',
  'Not Applicable': '#9aa0a6',
}

export default function OverallPieChart({ overall }: { overall: OverallStats }) {
  const data = [
    { name: 'Compliant', value: overall.compliant },
    { name: 'Non Compliant', value: overall.nonCompliant },
    { name: 'Not Applicable', value: overall.notApplicable },
  ].filter((d) => d.value > 0)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-apple-sm ring-1 ring-black/5">
      <h3 className="text-sm font-semibold text-gray-900">Overall compliance split</h3>
      <div className="mt-4 h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No answers yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                {data.map((d) => (
                  <Cell key={d.name} fill={COLORS[d.name]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
