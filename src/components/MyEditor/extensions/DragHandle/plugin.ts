import { type Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { dragHandler } from "./handler";
import {
  findElementNextToCoords,
  getOuterDomNode,
  getOuterNode,
  getOuterNodePos,
  hiddenDrag,
  repositionDragHandle,
  showDrag,
} from "./utils";

export type Current = {
  node: Node | null;
  pos: number;
};

export type Coords = { x: number; y: number } | null;

interface DragHandlePlugin {
  pluginKey: string;
  handleElement: HTMLElement;
  editor: Editor;
  nested?: boolean;
  onElementDragStart?: (e: DragEvent) => void;
  onElementDragEnd?: (e: DragEvent) => void;
  onNodeChange?: (data: {
    editor: Editor;
    node: Node | null;
    pos: number;
  }) => void;
}

export const DragHandlePlugin = (props: DragHandlePlugin) => {
  const {
    pluginKey,
    handleElement,
    editor,
    nested,
    onElementDragStart,
    onElementDragEnd,
    onNodeChange,
  } = props;

  // 手柄容器，通过手动定位控制手柄位置
  const wrapper = document.createElement("div");
  wrapper.appendChild(handleElement);
  // 手柄是否锁定
  let locked = false;
  // 聚焦的节点
  let current: Current = { node: null, pos: -1 };
  // 鼠标坐标
  let mouseCoords: Coords = null;
  // 事件循环id
  let rafId: number | null = null;

  function onDragStart(e: DragEvent) {
    onElementDragStart?.(e);
    dragHandler({ event: e, dragContext: current, nested: !!nested, editor });

    if (handleElement) handleElement.dataset.dragging = "true";

    setTimeout(() => {
      handleElement.style.pointerEvents = "none";
    }, 0);
  }
  function onDragEnd(e: DragEvent) {
    onElementDragEnd?.(e);
    if (handleElement) {
      handleElement.style.pointerEvents = "auto";
      handleElement.dataset.dragging = "false";
    }
  }

  const plugin = new Plugin({
    key: new PluginKey(pluginKey),
    state: {
      init() {
        return { locked: false };
      },
      // 事务被应用到editorstate时触发 dispatch tr=本次事务 value=插件自身的state
      apply(tr, value, oldState, newState) {
        const isLocked = tr.getMeta("lockDragHandle");
        const hideDragHandle = tr.getMeta("hideDragHandle");

        if (isLocked !== undefined) {
          locked = isLocked;
        }
        if (hideDragHandle) {
          hiddenDrag(handleElement);
          locked = false;
          current = { node: null, pos: -1 };
          onNodeChange?.({ editor, node: null, pos: -1 });
          return value;
        }
        // 确实发生了更新
        if (tr.docChanged && current.pos !== -1 && handleElement) {
          // 旧位置映射到新文档里的对应位置
          const newPos = tr.mapping.map(current.pos);
          
          if (newPos !== current.pos) {
            current.pos = newPos;
          }
        }

        return value;
      },
    },
    view: (view) => {
      // 编辑器同层级添加手柄容器
      wrapper.style.pointerEvents = "none";
      wrapper.style.position = "absolute";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      editor.view.dom.parentElement?.appendChild(wrapper);

      //   handleElement.style.pointerEvents = "auto";
      //   handleElement.dataset.dragging = "false";
      handleElement.addEventListener("dragstart", onDragStart);
      handleElement.addEventListener("dragend", onDragEnd);

      return {
        // 文档更新后同步手柄位置与状态
        update(view, prevState) {
          // step1. 判断是否可拖动&文档内容确实变化
          if (!handleElement || !editor.isEditable) {
            hiddenDrag(handleElement);
            return;
          }
          handleElement.draggable = !locked;
          if (view.state.doc.eq(prevState.doc) || current.pos === -1) return;

          // step2. 通过currentPos获取当前节点的顶层dom
          let domNode = view.nodeDOM(current.pos) as HTMLElement;
          domNode = getOuterDomNode(view, domNode);

          if (domNode === view.dom || domNode?.nodeType !== 1) return; // 不是有效dom

          // step3. 根据dom元素在文档里的位置转换为对应node
          const domNodePos = view.posAtDOM(domNode, 0);
          const outerNode = getOuterNode(editor.state.doc, domNodePos);
          const outerNodePos = getOuterNodePos(editor.state.doc, domNodePos);

          current = { node: outerNode, pos: outerNodePos };

          // step4. 更新手柄位置
          onNodeChange?.({ editor, node: current.node, pos: current.pos });
          repositionDragHandle(domNode as Element, handleElement);
        },
        // 清除监听 & 循环 & 容器
        destroy() {
          handleElement.removeEventListener("dragstart", onDragStart);
          handleElement.removeEventListener("dragend", onDragEnd);

          if (rafId) {
            cancelAnimationFrame(rafId);
            mouseCoords = null;
            rafId = null;
          }
          wrapper.parentNode?.removeChild(wrapper);
        },
      };
    },
    props: {
      handleDOMEvents: {
        // 按键 离屏时 隐藏手柄
        keydown: (_view) => {
          if (!handleElement || locked) {
            return false;
          }
          if (_view.hasFocus()) {
            hiddenDrag(handleElement);
            current = { node: null, pos: -1 };
            onNodeChange?.({ editor, node: null, pos: -1 });
            return false;
          }
          return false;
        },
        mouseleave: (_view, e) => {
          if (locked) return false;
          if (e.target && !wrapper.contains(e.relatedTarget as HTMLElement)) {
            hiddenDrag(handleElement);
            current = { node: null, pos: -1 };
            onNodeChange?.({ editor, node: null, pos: -1 });
          }
          return false;
        },
        // 更新手柄位置
        mousemove: (view, event) => {
          if (!handleElement || locked || rafId) {
            return false;
          }

          mouseCoords = { x: event.clientX, y: event.clientY };
          rafId = requestAnimationFrame(() => {
            rafId = null;
            if (!mouseCoords) return;
            // 1. 找到离鼠标最近的节点 targetNode
            const { x, y } = mouseCoords;
            mouseCoords = null;

            const nodeData = findElementNextToCoords({ x, y, editor, nested });
            if (!nodeData.resultElement) return;

            let domNode = nodeData.resultElement as HTMLElement;
            let targetNode = nodeData.resultNode;
            let targetNodePos = nodeData.pos;

            // 2. 根据嵌套情况更新目标节点
            if (!nested) {
              domNode = getOuterDomNode(view, domNode);
              if (domNode === view.dom || domNode?.nodeType !== 1) return; // 不是有效dom

              const domNodePos = view.posAtDOM(domNode, 0);
              targetNode = getOuterNode(editor.state.doc, domNodePos);
              targetNodePos = getOuterNodePos(editor.state.doc, domNodePos);
            }

            // 3. 确定聚焦节点变化 targetNode  != currentNode
            if (targetNode !== current.node) {
              current = { node: targetNode, pos: targetNodePos ?? -1};
              
              onNodeChange?.({ editor, node: current.node, pos: current.pos });
              repositionDragHandle(domNode as Element, handleElement);

              showDrag(handleElement)
            }
          });

          return false;
        },
      },
    },
  });

  return plugin;
};
