import type { AnswersMap, RoadmapEditsMap } from '../types'

const ANSWERS_KEY = 'pdppl_assessment_answers_v1'
const ROADMAP_EDITS_KEY = 'pdppl_roadmap_edits_v1'

export function loadAnswers(): AnswersMap {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    return raw ? (JSON.parse(raw) as AnswersMap) : {}
  } catch {
    return {}
  }
}

export function saveAnswers(answers: AnswersMap): void {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
}

export function loadRoadmapEdits(): RoadmapEditsMap {
  try {
    const raw = localStorage.getItem(ROADMAP_EDITS_KEY)
    return raw ? (JSON.parse(raw) as RoadmapEditsMap) : {}
  } catch {
    return {}
  }
}

export function saveRoadmapEdits(edits: RoadmapEditsMap): void {
  localStorage.setItem(ROADMAP_EDITS_KEY, JSON.stringify(edits))
}

export function clearAll(): void {
  localStorage.removeItem(ANSWERS_KEY)
  localStorage.removeItem(ROADMAP_EDITS_KEY)
}
