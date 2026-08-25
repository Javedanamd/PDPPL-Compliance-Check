import type { AnswersMap, DomainStats, OverallStats, Rag } from '../types'
import { CONTROLS_BY_DOMAIN, DOMAINS } from '../data/controls'

/**
 * RAG thresholds replicate the source workbook's conditional formatting on
 * `Working Sheet!F4:F16` (percentage = Compliant / (Compliant + Non Compliant),
 * i.e. Not Applicable is excluded from both sides of the ratio):
 *   < 50%        -> red
 *   50% to <75%  -> amber
 *   >= 75%       -> green
 *   no applicable controls -> gray ("no data")
 */
export function ragFromPercentage(pct: number | null): Rag {
  if (pct === null) return 'gray'
  if (pct < 0.5) return 'red'
  if (pct < 0.75) return 'amber'
  return 'green'
}

export function computeDomainStats(answers: AnswersMap): DomainStats[] {
  return DOMAINS.map((domain) => {
    const controls = CONTROLS_BY_DOMAIN[domain]
    let compliant = 0
    let nonCompliant = 0
    let notApplicable = 0
    for (const control of controls) {
      const status = answers[control.controlId]?.complianceStatus
      if (status === 'Compliant') compliant++
      else if (status === 'Non Compliant') nonCompliant++
      else if (status === 'Not Applicable') notApplicable++
    }
    const applicable = compliant + nonCompliant
    const percentage = applicable > 0 ? compliant / applicable : null
    return {
      domain,
      compliant,
      nonCompliant,
      notApplicable,
      applicable,
      total: controls.length,
      percentage,
      rag: ragFromPercentage(percentage),
    }
  })
}

export function computeOverallStats(domainStats: DomainStats[]): OverallStats {
  const compliant = domainStats.reduce((s, d) => s + d.compliant, 0)
  const nonCompliant = domainStats.reduce((s, d) => s + d.nonCompliant, 0)
  const notApplicable = domainStats.reduce((s, d) => s + d.notApplicable, 0)
  const total = domainStats.reduce((s, d) => s + d.total, 0)
  const applicable = compliant + nonCompliant
  const percentage = applicable > 0 ? compliant / applicable : null
  return {
    compliant,
    nonCompliant,
    notApplicable,
    applicable,
    total,
    percentage,
    rag: ragFromPercentage(percentage),
  }
}
