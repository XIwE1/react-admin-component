import type { Node } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'

import { defaultRules } from './defaultRules'
import { NESTED_DEFAULT_EDGE_CONFIG } from './edgeDetection'
import { calculateScore } from './scoring'
import type { DragHandleRule, RuleContext } from './types/rules'

export interface DragTarget {
  node: Node
  pos: number
  dom: HTMLElement
}

/**
 * 嵌套模式下根据坐标与规则打分，选出最佳拖拽目标。
 * `nested === false` 时直接返回 null（由 findElementNextToCoords 走顶层块逻辑）。
 */
export function findBestDragTarget(
  view: EditorView,
  coords: { x: number; y: number },
  nested: boolean,
): DragTarget | null {
  if (!nested) {
    return null
  }

  if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
    return null
  }

  const posInfo = view.posAtCoords({ left: coords.x, top: coords.y })

  if (!posInfo) {
    return null
  }

  const { doc } = view.state
  const $pos = doc.resolve(posInfo.pos)

  const rules: DragHandleRule[] = [...defaultRules]
  const edgeDetection = NESTED_DEFAULT_EDGE_CONFIG

  const depthLevels = Array.from({ length: $pos.depth }, (_, i) => $pos.depth - i)

  const candidates = depthLevels
    .map(depth => {
      const node = $pos.node(depth)
      const nodePos = $pos.before(depth)

      const parent = depth > 0 ? $pos.node(depth - 1) : null
      const index = depth > 0 ? $pos.index(depth - 1) : 0
      const siblingCount = parent ? parent.childCount : 1

      const context: RuleContext = {
        node,
        pos: nodePos,
        depth,
        parent,
        index,
        isFirst: index === 0,
        isLast: index === siblingCount - 1,
        $pos,
        view,
      }

      const score = calculateScore(context, rules, edgeDetection, coords)

      if (score < 0) {
        return null
      }

      const dom = view.nodeDOM(nodePos) as HTMLElement | null

      return { node, pos: nodePos, depth, score, dom }
    })
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)

  const nodeAfter = $pos.nodeAfter

  if (nodeAfter && nodeAfter.isAtom && !nodeAfter.isInline) {
    const nodePos = posInfo.pos
    const depth = $pos.depth + 1
    const parent = $pos.parent
    const index = $pos.index()
    const siblingCount = parent.childCount

    const context: RuleContext = {
      node: nodeAfter,
      pos: nodePos,
      depth,
      parent,
      index,
      isFirst: index === 0,
      isLast: index === siblingCount - 1,
      $pos,
      view,
    }

    const score = calculateScore(context, rules, edgeDetection, coords)

    if (score >= 0) {
      const dom = view.nodeDOM(nodePos) as HTMLElement | null

      if (dom) {
        candidates.push({ node: nodeAfter, pos: nodePos, depth, score, dom })
      }
    }
  }

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }

    return b.depth - a.depth
  })

  const winner = candidates[0]

  if (!winner.dom) {
    return null
  }

  return {
    node: winner.node,
    pos: winner.pos,
    dom: winner.dom,
  }
}
