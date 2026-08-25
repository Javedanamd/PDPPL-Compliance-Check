import type { Answer, AnswersMap, DomainStats } from '../types'
import { CONTROLS_BY_DOMAIN, DOMAINS } from '../data/controls'
import DomainSection from './DomainSection'

interface Props {
  answers: AnswersMap
  domainStats: DomainStats[]
  onChange: (controlId: string, answer: Answer) => void
}

export default function AssessmentView({ answers, domainStats, onChange }: Props) {
  const statsByDomain = Object.fromEntries(domainStats.map((d) => [d.domain, d]))

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16">
      {DOMAINS.map((domain, i) => (
        <DomainSection
          key={domain}
          domain={domain}
          controls={CONTROLS_BY_DOMAIN[domain]}
          answers={answers}
          stats={statsByDomain[domain]}
          onChange={onChange}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  )
}
