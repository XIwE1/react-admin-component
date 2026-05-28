import type { DragHandleRule, RuleContext } from './types/rules'
import { type EdgeDetectionConfig, calculateEdgeDeduction } from './edgeDetection'

export const BASE_SCORE = 1000

export function calculateScore(
  context: RuleContext,
  rules: DragHandleRule[],
  edgeConfig: EdgeDetectionConfig,
  coords: { x: number; y: number },
): number {
  let score = BASE_SCORE
  let excluded = false

  rules.every(rule => {
    const deduction = rule.evaluate(context)

    score -= deduction

    if (score <= 0) {
      excluded = true
      return false
    }

    return true
  })

  if (excluded) {
    return -1
  }

  const dom = context.view.nodeDOM(context.pos) as HTMLElement | null

  score -= calculateEdgeDeduction(coords, dom, edgeConfig, context.depth)

  if (score <= 0) {
    return -1
  }

  return score
}
