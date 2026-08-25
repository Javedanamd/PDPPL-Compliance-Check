export type ComplianceStatus = 'Compliant' | 'Non Compliant' | 'Not Applicable'

export const COMPLIANCE_STATUS_OPTIONS: ComplianceStatus[] = [
  'Compliant',
  'Non Compliant',
  'Not Applicable',
]

export interface Control {
  sNo: number
  domain: string
  controlId: string
  controlTitle: string
  controlDescription: string
  controlType: string
  lawReference: string
  guidelinesReference: string
  penalties: string
}

export interface Answer {
  observation: string
  complianceStatus: ComplianceStatus | ''
}

export type AnswersMap = Record<string, Answer>

export type RoadmapStatus = 'Yet to Start' | 'In Progress' | 'Completed'

export const ROADMAP_STATUS_OPTIONS: RoadmapStatus[] = [
  'Yet to Start',
  'In Progress',
  'Completed',
]

export interface RoadmapEdit {
  implementationSteps?: string
  responsibleStakeholder?: string
  priority?: string
  timeline?: string
  status?: RoadmapStatus
}

export type RoadmapEditsMap = Record<string, RoadmapEdit>

export interface RoadmapItem {
  domain: string
  controlId: string
  controlTitle: string
  implementationSteps: string
  responsibleStakeholder: string
  priority: string
  timeline: string
  status: RoadmapStatus
}

export type Rag = 'red' | 'amber' | 'green' | 'gray'

export interface DomainStats {
  domain: string
  compliant: number
  nonCompliant: number
  notApplicable: number
  applicable: number
  total: number
  percentage: number | null
  rag: Rag
}

export interface OverallStats {
  compliant: number
  nonCompliant: number
  notApplicable: number
  applicable: number
  total: number
  percentage: number | null
  rag: Rag
}
