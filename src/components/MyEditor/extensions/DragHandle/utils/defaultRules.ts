import type { DragHandleRule } from './types/rules'

export const listItemFirstChild: DragHandleRule = {
  id: 'listItemFirstChild',
  evaluate: ({ parent, isFirst }) => {
    if (!isFirst) {
      return 0
    }

    const listItemTypes = ['listItem', 'taskItem']

    if (parent && listItemTypes.includes(parent.type.name)) {
      return 1000
    }

    return 0
  },
}

export const listWrapperDeprioritize: DragHandleRule = {
  id: 'listWrapperDeprioritize',
  evaluate: ({ node }) => {
    const listItemTypes = ['listItem', 'taskItem']
    const firstChild = node.firstChild

    if (firstChild && listItemTypes.includes(firstChild.type.name)) {
      return 1000
    }

    return 0
  },
}

export const tableStructure: DragHandleRule = {
  id: 'tableStructure',
  evaluate: ({ node, parent }) => {
    const tableStructureTypes = ['tableRow', 'tableCell', 'tableHeader']

    if (tableStructureTypes.includes(node.type.name)) {
      return 1000
    }

    if (parent && parent.type.name === 'tableHeader') {
      return 1000
    }

    return 0
  },
}

export const inlineContent: DragHandleRule = {
  id: 'inlineContent',
  evaluate: ({ node }) => {
    if (node.isInline || node.isText) {
      return 1000
    }

    return 0
  },
}

export const defaultRules: DragHandleRule[] = [
  listItemFirstChild,
  listWrapperDeprioritize,
  tableStructure,
  inlineContent,
]
