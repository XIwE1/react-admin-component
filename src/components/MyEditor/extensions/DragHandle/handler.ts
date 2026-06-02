import { type Editor } from "@tiptap/core";
import { Current } from "./plugin";
import {
  getSelectionRanges,
  NodeRangeSelection,
} from "@tiptap/extension-node-range";
import { type SelectionRange, NodeSelection } from "@tiptap/pm/state";
import {
  cloneElement,
  getDraggedBlockElement,
  getDragRanges,
  removeNode,
} from "./utils";

interface dragHandlerProps {
  event: DragEvent;
  editor: Editor;
  nested: boolean;
  dragContext: Current;
}

export function dragHandler(props: dragHandlerProps) {
  const { event, editor, nested, dragContext } = props;
  const { view } = editor;
  const { tr } = view.state;

  if (!event.dataTransfer) return;

  // step1. 确定拖拽范围ranges
  const { $from, $to, empty } = view.state.selection;

  const dragRanges = getDragRanges(event, editor, nested, dragContext);
  // depth = 0 只会选出最外层的节点 undefined不设置会推断出最小公共深度
  const selectionRanges = getSelectionRanges($from, $to, 0, {
    extendOnBoundaryOverlap: false,
  });
  console.log("handler - dragRanges", dragRanges, dragRanges.length);
  console.log("handler - selectionRanges", selectionRanges, selectionRanges.length);

  // case: selectionRange >= dragRange,重新计算出完整的拖拽范围
  const isDragWithinSelection = selectionRanges.some((range) => {
    return dragRanges.find((dragRange) => {
      return dragRange.$from === range.$from && dragRange.$to === range.$to;
    });
  });
  console.log("handler - isDragWithinSelection", isDragWithinSelection);

  // const isHandleInSelection = selectionRanges.some(
  //   (range) => dragContext.pos >= range.$from.pos && dragContext.pos < range.$to.pos,
  // );

  // A || B ? C : D = (A || B) ? C : D
  // const ranges = empty || isDragWithinSelection ? selectionRanges : dragRanges; 理解错了会写成这样
  const ranges = empty || !isDragWithinSelection ? dragRanges : selectionRanges;
  // const ranges = empty || !isHandleInSelection ? dragRanges : selectionRanges;

  console.log("draghandler - ranges", ranges);

  if (!ranges.length) return;

  // step2. 根据范围ranges切片出内容slice和选区selection
  const [from, to] = [ranges[0].$from.pos, ranges[ranges.length - 1].$to.pos];
  let selection;
  let slice;

  const isSingleBlock =
    ranges.length === 1 &&
    ranges[0].$from.pos === from &&
    ranges[0].$to.pos === to;

  // nestedOptions.enabled && dragContext.node
  // 只能说明：当前设置支持在嵌套结构里用手柄定位内层块，不能推出「这一次正在做嵌套单块拖拽」
  const isNestedDrag = nested && dragContext.node;

  // if (isNestedDrag) 可能导致多选情况下错误的进入嵌套单选逻辑
  if (isNestedDrag && isSingleBlock) {
    slice = view.state.doc.slice(from, to);
    selection = NodeSelection.create(view.state.doc, from);
  } else {
    selection = NodeRangeSelection.create(view.state.doc, from, to);
    slice = selection.content();
  }

  // step3. 拖拽内容预览
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.top = "-1000px";
  document.body.append(wrapper);

  ranges.forEach((range) => {
    const element = getDraggedBlockElement(
      view,
      range.$from.pos,
    ) as HTMLElement | null;
    if (!element) return;

    const _element = cloneElement(element);
    _element.style.margin = "0";
    wrapper.appendChild(_element);
  });

  // 设置datatransfer
  event.dataTransfer.clearData();
  event.dataTransfer.setDragImage(wrapper, 0, 0);

  // step4. 派发pm事务 同步拖拽内容 选区
  const nodeSelection =
    selection instanceof NodeSelection ? selection : undefined;

  // selection instanceof NodeSelection ? node.replace(tr) : tr.deleteSelection()
  // 多选情况下 Selection = NodeRangeSelection 需要 .deleteSelection() 删除选区
  view.dragging = {
    slice,
    move: true,
    node: nodeSelection,
  } as typeof view.dragging;

  tr.setSelection(selection);
  view.dispatch(tr);

  // step5. 清除拖拽预览
  let cleanedUp = false;

  const cleanupDragPreview = () => {
    if (cleanedUp) {
      return;
    }

    cleanedUp = true;
    removeNode(wrapper);
    document.removeEventListener("drop", cleanupDragPreview);
    document.removeEventListener("dragend", cleanupDragPreview);
  };
  document.addEventListener("dragend", cleanupDragPreview);
  document.addEventListener("drop", cleanupDragPreview);
}
