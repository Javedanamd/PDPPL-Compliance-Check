import * as XLSX from 'xlsx'
import type { AnswersMap, ComplianceStatus, RoadmapItem } from '../types'
import { COMPLIANCE_STATUS_OPTIONS } from '../types'
import { CONTROLS } from '../data/controls'

const ASSESSMENT_HEADERS = [
  'S.No',
  'Domain',
  'Control ID',
  'Control Title',
  'Control Description',
  'Control Type',
  'Law Reference',
  'Guidelines Reference',
  'Penalties',
  'Observation',
  'Compliance Status',
]

export function exportAssessmentToExcel(answers: AnswersMap, fileName = 'PDPPL-Assessment.xlsx') {
  const rows: (string | number)[][] = [ASSESSMENT_HEADERS]
  for (const c of CONTROLS) {
    const a = answers[c.controlId]
    rows.push([
      c.sNo,
      c.domain,
      c.controlId,
      c.controlTitle,
      c.controlDescription,
      c.controlType,
      c.lawReference,
      c.guidelinesReference,
      c.penalties,
      a?.observation ?? '',
      a?.complianceStatus ?? '',
    ])
  }
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [
    { wch: 6 }, { wch: 22 }, { wch: 10 }, { wch: 28 }, { wch: 50 },
    { wch: 14 }, { wch: 16 }, { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 16 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Assessment')
  XLSX.writeFile(wb, fileName)
}

const ROADMAP_HEADERS = [
  'Domain',
  'Control ID',
  'Control Title',
  'Implementation Steps',
  'Responsible Stakeholder',
  'Priority',
  'Timeline',
  'Status',
]

export function exportRoadmapToExcel(items: RoadmapItem[], fileName = 'PDPPL-Roadmap.xlsx') {
  const rows: string[][] = [ROADMAP_HEADERS]
  for (const item of items) {
    rows.push([
      item.domain,
      item.controlId,
      item.controlTitle,
      item.implementationSteps,
      item.responsibleStakeholder,
      item.priority,
      item.timeline,
      item.status,
    ])
  }
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [
    { wch: 22 }, { wch: 10 }, { wch: 28 }, { wch: 34 }, { wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Roadmap')
  XLSX.writeFile(wb, fileName)
}

function normalizeHeader(h: unknown): string {
  return String(h ?? '').trim().toLowerCase()
}

function normalizeStatus(v: unknown): ComplianceStatus | '' {
  const s = String(v ?? '').trim()
  const match = COMPLIANCE_STATUS_OPTIONS.find(
    (opt) => opt.toLowerCase() === s.toLowerCase(),
  )
  return match ?? ''
}

/**
 * Parses an uploaded .xlsx built with the same column layout as
 * exportAssessmentToExcel (or the original Organization.xlsx "Assessment"
 * sheet). Matches rows by Control ID so re-ordering/missing rows are safe;
 * unrecognized Control IDs are ignored, missing ones are left untouched.
 */
export async function importAssessmentFromExcel(file: File): Promise<AnswersMap> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheetName = wb.SheetNames.find((n) => n.toLowerCase() === 'assessment') ?? wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false })

  let headerRowIdx = -1
  let controlIdCol = -1
  let observationCol = -1
  let statusCol = -1
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const idx = row.findIndex((cell) => normalizeHeader(cell) === 'control id')
    if (idx !== -1) {
      headerRowIdx = i
      controlIdCol = idx
      observationCol = row.findIndex((cell) => normalizeHeader(cell) === 'observation')
      statusCol = row.findIndex((cell) => normalizeHeader(cell) === 'compliance status')
      break
    }
  }
  if (headerRowIdx === -1 || controlIdCol === -1) {
    throw new Error(
      'Could not find a "Control ID" column. Please upload a file exported from this app or the original Assessment template.',
    )
  }

  const validIds = new Set(CONTROLS.map((c) => c.controlId))
  const result: AnswersMap = {}
  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const controlId = String(row[controlIdCol] ?? '').trim()
    if (!validIds.has(controlId)) continue
    const observation = observationCol !== -1 ? String(row[observationCol] ?? '') : ''
    const complianceStatus = statusCol !== -1 ? normalizeStatus(row[statusCol]) : ''
    result[controlId] = { observation, complianceStatus }
  }
  return result
}
