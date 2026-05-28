export type EdgeDetectionConfig = {
  edges: Array<'left' | 'right' | 'top' | 'bottom'>
  threshold: number
  strength: number
}

/** 与 tiptap `normalizeNestedOptions(true)` 默认一致 */
export const NESTED_DEFAULT_EDGE_CONFIG: EdgeDetectionConfig = {
  edges: ['left', 'top'],
  threshold: 12,
  strength: 500,
}

export function isNearEdge(
  coords: { x: number; y: number },
  element: HTMLElement,
  config: EdgeDetectionConfig,
): boolean {
  if (config.edges.length === 0) {
    return false
  }

  const rect = element.getBoundingClientRect()
  const { threshold, edges } = config

  return edges.some(edge => {
    if (edge === 'left') {
      return coords.x - rect.left < threshold
    }

    if (edge === 'right') {
      return rect.right - coords.x < threshold
    }

    if (edge === 'top') {
      return coords.y - rect.top < threshold
    }

    if (edge === 'bottom') {
      return rect.bottom - coords.y < threshold
    }

    return false
  })
}

export function calculateEdgeDeduction(
  coords: { x: number; y: number },
  element: HTMLElement | null,
  config: EdgeDetectionConfig,
  depth: number,
): number {
  if (!element || config.edges.length === 0) {
    return 0
  }

  if (isNearEdge(coords, element, config)) {
    return config.strength * depth
  }

  return 0
}
