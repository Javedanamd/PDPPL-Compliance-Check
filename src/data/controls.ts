import raw from './controls.json'
import type { Control } from '../types'

export const CONTROLS: Control[] = raw as Control[]

export const DOMAINS: string[] = (() => {
  const seen = new Set<string>()
  const order: string[] = []
  for (const c of CONTROLS) {
    if (!seen.has(c.domain)) {
      seen.add(c.domain)
      order.push(c.domain)
    }
  }
  return order
})()

export const CONTROLS_BY_DOMAIN: Record<string, Control[]> = (() => {
  const map: Record<string, Control[]> = {}
  for (const domain of DOMAINS) map[domain] = []
  for (const c of CONTROLS) map[c.domain].push(c)
  return map
})()
