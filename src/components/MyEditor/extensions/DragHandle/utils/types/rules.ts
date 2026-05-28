import type { Node, ResolvedPos } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'

export interface RuleContext {
  node: Node
  pos: number
  depth: number
  parent: Node | null
  index: number
  isFirst: boolean
  isLast: boolean
  $pos: ResolvedPos
  view: EditorView
}

export interface DragHandleRule {
  id: string
  evaluate: (context: RuleContext) => number
}
