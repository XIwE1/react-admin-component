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
  const selectionRanges = getSelectionRanges($from, $to, 0, {
    extendOnBoundaryOverlap: false,
  });

  // case: selectionRange >= dragRange,重新计算出完整的拖拽范围
  const isDragWithinSelection = selectionRanges.some((range) => {
    return dragRanges.find((dragRange) => {
      return dragRange.$from === range.$from && dragRange.$to === range.$to;
    });
  });

  // A || B ? C : D = (A || B) ? C : D
  // const ranges = empty || isDragWithinSelection ? selectionRanges : dragRanges;
  const ranges = (empty || !isDragWithinSelection) ? dragRanges : selectionRanges;

  console.log("draghandler - ranges", ranges);

  if (!ranges.length) return;

  // step2. 根据范围ranges切片出内容和计算选区
  const [from, to] = [ranges[0].$from.pos, ranges[ranges.length - 1].$to.pos];
  let selection: any = NodeRangeSelection.create(view.state.doc, from, to);
  let slice = selection.content();

  if (nested && dragContext.node) {
    slice = view.state.doc.slice(from, to);
    selection = NodeSelection.create(view.state.doc, from);
  }

  // step3. 拖拽内容预览
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.top = "-1000px";
  document.body.append(wrapper)

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
  view.dragging = {
    slice,
    move: true,
    node: selection,
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
