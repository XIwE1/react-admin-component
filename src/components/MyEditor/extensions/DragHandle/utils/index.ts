import { computePosition } from "@floating-ui/dom";
import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";
import { type SelectionRange, NodeSelection } from "@tiptap/pm/state";
import { getSelectionRanges } from "@tiptap/extension-node-range";

import { findElementNextToCoords } from "./findElementNextToCoords";

export { findElementNextToCoords };

export interface DragContext {
  node: PMNode | null;
  pos: number;
}

export function hiddenDrag(target: HTMLElement) {
  if (!target) return;

  target.style.visibility = "hidden";
  target.style.pointerEvents = "none";
}

export function showDrag(target: HTMLElement) {
  if (!target) return;

  target.style.visibility = "";
  target.style.pointerEvents = "auto";
}

// 根据dom重新地位target元素的位置
export function repositionDragHandle(dom: Element, target: HTMLElement) {
  computePosition(dom, target).then((val) => {
    Object.assign(target.style, {
      position: val.strategy,
      left: `${val.x}px`,
      top: `${val.y}px`,
    });
  });
}

export const getOuterNodePos = (doc: PMNode, pos: number): number => {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;

  if (depth === 0) {
    return pos;
  }

  const a = resolvedPos.pos - resolvedPos.parentOffset;

  return a - 1;
};

export const getOuterNode = (doc: PMNode, pos: number): PMNode | null => {
  const node = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);

  let { depth } = resolvedPos;
  let parent = node;

  // 直到node.depth=1
  while (depth > 0) {
    const currentNode = resolvedPos.node(depth);

    depth -= 1;

    if (depth === 0) {
      parent = currentNode;
    }
  }

  return parent;
};

export const getOuterDomNode = (view: EditorView, domNode: HTMLElement) => {
  let tmpDomNode = domNode;

  // 递归
  while (tmpDomNode?.parentNode) {
    if (tmpDomNode.parentNode === view.dom) {
      break;
    }

    tmpDomNode = tmpDomNode.parentNode as HTMLElement;
  }

  return tmpDomNode;
};

// 获取被拖拽元素的范围 SelectionRange[]
export function getDragRanges(
  event: DragEvent,
  editor: Editor,
  nested?: boolean,
  dragContext?: DragContext,
): SelectionRange[] {
  const { doc } = editor.view.state;
  // 嵌套模式 且 有拖拽上下文(currentNode和pos)
  if (nested && dragContext?.node && dragContext.pos >= 0) {
    const nodeStart = dragContext.pos;
    const nodeEnd = dragContext.pos + dragContext.node.nodeSize;

    return [
      {
        $from: doc.resolve(nodeStart),
        $to: doc.resolve(nodeEnd),
      },
    ];
  }

  // 根据鼠标位置获取最近节点
  const result = findElementNextToCoords({
    editor,
    x: event.clientX,
    y: event.clientY,
    nested,
  });

  if (!result.resultNode || result.pos === null) {
    return [];
  }

  // 非嵌套模式，用 depth = 0 拿取外层block 用于拖拽
  const offset = result.resultNode.isText || result.resultNode.isAtom ? 0 : -1;
  const $from = doc.resolve(result.pos);
  const $to = doc.resolve(result.pos + result.resultNode.nodeSize + offset);

  return getSelectionRanges($from, $to, 0, { extendOnBoundaryOverlap: false });
}

export function getDraggedBlockElement(view: EditorView, pos: number) {
  const nodeDom = view.nodeDOM(pos);

  if (nodeDom instanceof Element && nodeDom !== view.dom) {
    return nodeDom;
  }

  const { node, offset } = view.domAtPos(pos);
  const child = node.childNodes[offset];

  if (child instanceof Element) {
    return child;
  }

  if (node instanceof Element) {
    return node;
  }

  if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
    return node.parentElement;
  }

  return null;
}

export function removeNode(node: HTMLElement) {
  node.parentElement?.removeChild(node);
}

// clone对应元素与其样式
export function cloneElement(node: HTMLElement) {
  const clonedNode = node.cloneNode(true) as HTMLElement;
  const sourceElements = [
    node,
    ...Array.from(node.getElementsByTagName("*")),
  ] as HTMLElement[];
  const targetElements = [
    clonedNode,
    ...Array.from(clonedNode.getElementsByTagName("*")),
  ] as HTMLElement[];

  sourceElements.forEach((sourceElement, index) => {
    targetElements[index].style.cssText = getCSSText(sourceElement);
  });

  return clonedNode;
}

function getCSSText(element: Element) {
  const style = getComputedStyle(element);

  let value = "";

  for (let i = 0; i < style.length; i += 1) {
    value += `${style[i]}:${style.getPropertyValue(style[i])};`;
  }

  return value;
}
