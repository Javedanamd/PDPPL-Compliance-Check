import type { AnswersMap, RoadmapEditsMap, RoadmapItem } from '../types'
import { CONTROLS } from '../data/controls'

export const PLACEHOLDER = 'To be filled by the Privacy Team'

/**
 * Replicates the source workbook's Roadmap sheet: every control whose
 * Compliance Status is exactly "Non Compliant" produces one roadmap row, in
 * original Assessment order. "Compliant" and "Not Applicable" controls never
 * appear here. Action-item fields have no per-control logic in the source
 * file -- they're identical placeholder text meant for manual follow-up.
 */
export function generateRoadmap(
  answers: AnswersMap,
  edits: RoadmapEditsMap,
): RoadmapItem[] {
  return CONTROLS.filter(
    (c) => answers[c.controlId]?.complianceStatus === 'Non Compliant',
  ).map((c) => {
    const edit = edits[c.controlId]
    return {
      domain: c.domain,
      controlId: c.controlId,
      controlTitle: c.controlTitle,
      implementationSteps: edit?.implementationSteps ?? PLACEHOLDER,
      responsibleStakeholder: edit?.responsibleStakeholder ?? PLACEHOLDER,
      priority: edit?.priority ?? PLACEHOLDER,
      timeline: edit?.timeline ?? PLACEHOLDER,
      status: edit?.status ?? 'Yet to Start',
    }
  })
}
