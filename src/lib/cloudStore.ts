import type { AnswersMap, RoadmapEditsMap } from '../types'
import { supabase } from './supabaseClient'

export interface CloudAssessment {
  answers: AnswersMap
  roadmapEdits: RoadmapEditsMap
  updatedAt: string | null
}

/**
 * Reads the signed-in user's saved assessment row, if one exists yet.
 * Returns null if the user has never saved before (first sign-in).
 */
export async function loadCloudAssessment(userId: string): Promise<CloudAssessment | null> {
  if (!supabase) throw new Error('Cloud save is not configured.')
  const { data, error } = await supabase
    .from('assessments')
    .select('answers, roadmap_edits, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    answers: (data.answers as AnswersMap) ?? {},
    roadmapEdits: (data.roadmap_edits as RoadmapEditsMap) ?? {},
    updatedAt: data.updated_at,
  }
}

export async function saveCloudAssessment(
  userId: string,
  answers: AnswersMap,
  roadmapEdits: RoadmapEditsMap,
): Promise<void> {
  if (!supabase) throw new Error('Cloud save is not configured.')
  const { error } = await supabase.from('assessments').upsert(
    {
      user_id: userId,
      answers,
      roadmap_edits: roadmapEdits,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) throw error
}
