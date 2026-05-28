import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'

import { findBestDragTarget } from './findBestDragTarget'

export type FindElementNextToCoords = {
  x: number
  y: number
  direction?: 'left' | 'right'
  editor: Editor
  nested?: boolean
}

/**
 * 递归获取当前节点的顶级block
 */
export function findClosestTopLevelBlock(element: Element, view: EditorView): HTMLElement | undefined {
  let current: Element | null = element

  while (current?.parentElement && current.parentElement !== view.dom) {
    current = current.parentElement
  }

  return current?.parentElement === view.dom ? (current as HTMLElement) : undefined
}

/**
 * Checks if a DOMRect has valid, finite dimensions.
 */
function isValidRect(rect: DOMRect): boolean {
  return (
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.bottom) &&
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.right) &&
    rect.width > 0 &&
    rect.height > 0
  )
}

/**
 * 取 firstElement/lastElement 的 Rect，将 X、Y 限制在其中
 */
function clampToContent(view: EditorView, x: number, y: number, inset = 5): { x: number; y: number } | null {
  // Validate input coordinates are finite numbers
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }

  const container = view.dom
  const firstBlock = container.firstElementChild
  const lastBlock = container.lastElementChild

  if (!firstBlock || !lastBlock) {
    return null
  }

  // Clamp Y between first and last block
  const topRect = firstBlock.getBoundingClientRect()
  const botRect = lastBlock.getBoundingClientRect()

  // Validate bounding rects have finite values
  if (!isValidRect(topRect) || !isValidRect(botRect)) {
    return null
  }

  const clampedY = Math.min(Math.max(topRect.top + inset, y), botRect.bottom - inset)

  const epsilon = 0.5
  const sameLeft = Math.abs(topRect.left - botRect.left) < epsilon
  const sameRight = Math.abs(topRect.right - botRect.right) < epsilon

  let rowRect: DOMRect = topRect

  if (sameLeft && sameRight) {
    // Most of the time, every block has the same width
    rowRect = topRect
  } else {
    // TODO
    // find the actual block at the clamped Y
    // This case is rare, avoid for now
  }

  // Clamp X to the chosen block's bounds
  const clampedX = Math.min(Math.max(rowRect.left + inset, x), rowRect.right - inset)

  // Final validation of output coordinates
  if (!Number.isFinite(clampedX) || !Number.isFinite(clampedY)) {
    return null
  }

  return { x: clampedX, y: clampedY }
}

// 作用：coords 鼠标位置 (x, y) ->  { element, node, pos }
export const findElementNextToCoords = (
  options: FindElementNextToCoords,
): {
  resultElement: HTMLElement | null
  resultNode: Node | null
  pos: number | null
} => {
  const { x, y, editor, nested } = options
  const { view, state } = editor

  // 1. 原坐标通过 clampToContent 转换出 clampX、clampY
  const clamped = clampToContent(view, x, y, 5)

  if (!clamped) {
    return { resultElement: null, resultNode: null, pos: null }
  }

  const { x: clampedX, y: clampedY } = clamped

  // 2. 支持嵌套时 findBestDragTarget 根据打分机制获取最合适的节点
  if (nested) {
    const target = findBestDragTarget(view, { x: clampedX, y: clampedY }, nested)

    if (!target) {
      return { resultElement: null, resultNode: null, pos: null }
    }

    return {
      resultElement: target.dom,
      resultNode: target.node,
      pos: target.pos,
    }
  }

  // 3. domAPI - elementsFromPoint 获取对应位置的元素
  const elements = view.root.elementsFromPoint(clampedX, clampedY)

  let block: HTMLElement | undefined

  Array.prototype.some.call(elements, (el: Element) => {
    if (!view.dom.contains(el)) {
      return false
    }
    // findClosestTopLevelBlock 对应元素的顶级block
    const candidate = findClosestTopLevelBlock(el, view)
    if (candidate) {
      block = candidate
      return true
    }
    return false
  })

  if (!block) {
    // elementsFromPoint 可能无法获取到元素（比如间距，间隙，缩进，遮罩层...等情况） 处理
    const coords = view.posAtCoords({ left: clampedX, top: clampedY })

    if (coords) {
      const $pos = state.doc.resolve(coords.pos)
      // Walk up to the top-level block
      const depth = Math.min($pos.depth, 1)
      const blockPos = depth > 0 ? $pos.before(depth) : $pos.pos
      const blockNode = state.doc.nodeAt(blockPos)

      if (blockNode) {
        const dom = view.nodeDOM(blockPos)

        return {
          resultElement: dom instanceof HTMLElement ? dom : null,
          resultNode: blockNode,
          pos: blockPos,
        }
      }
    }

    return { resultElement: null, resultNode: null, pos: null }
  }

  let pos: number
  try {
    pos = view.posAtDOM(block, 0)
  } catch {
    return { resultElement: null, resultNode: null, pos: null }
  }

  const node = state.doc.nodeAt(pos)

  if (!node) {
    // 4. 获取block在 editor.view 的 位置 pos，根据位置找到节点 node
    const resolvedPos = state.doc.resolve(pos)
    const parent = resolvedPos.parent

    return {
      resultElement: block,
      resultNode: parent,
      pos: resolvedPos.start(),
    }
  }

  return {
    resultElement: block,
    resultNode: node,
    pos,
  }
}
