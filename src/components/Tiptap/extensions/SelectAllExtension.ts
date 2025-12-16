import { Extension, type Editor } from "@tiptap/core";

// 使用责任链模式
// 每个板块分别处理自己各自的逻辑，但他们聚合到一起的时候又能在自己对应的场景生效而不影响其他功能

/**
 * 抽象处理器类：定义责任链节点的接口
 */
abstract class Handler {
  protected nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler; // 支持链式调用
  }

  handleRequest(editor: Editor): boolean {
    if (this.canHandle(editor)) {
      return this.handle(editor);
    }
    // 如果当前处理器无法处理，传递给下一个处理器
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(editor);
    }
    // 链的末端，默认返回 false，使用 Tiptap 的默认行为
    return false;
  }

  abstract canHandle(editor: Editor): boolean;

  // 处理请求
  abstract handle(editor: Editor): boolean;
}

// 代码块处理器
class CodeBlockHandler extends Handler {
  canHandle(editor: Editor): boolean {
    const { $anchor } = editor.state.selection;

    for (let depth = $anchor.depth; depth > 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === "codeBlock") {
        return true;
      }
    }
    return false;
  }

  handle(editor: Editor): boolean {
    const { selection } = editor.state;
    const { $anchor } = selection;

    // 找到代码块节点
    for (let depth = $anchor.depth; depth > 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === "codeBlock") {
        // 获取节点的起始位置
        const start = $anchor.start(depth);
        // 获取节点内容的起始位置
        const contentStart = start;
        // 获取节点内容的结束位置
        const contentEnd = $anchor.end(depth);

        // 检查当前选择是否已经是代码块的全部内容
        const currentFrom = selection.from;
        const currentTo = selection.to;
        if (currentFrom === contentStart && currentTo === contentEnd) {
          // 如果已经选中全部内容，交给下一级处理
          return false;
        }

        // 确保选择范围有效
        if (contentEnd > contentStart) {
          // 选择代码块内的内容（不包括节点本身）
          editor.commands.setTextSelection({ from: contentStart, to: contentEnd });
        } else {
          // 如果内容为空，将光标放在内容开始位置
          editor.commands.setTextSelection(contentStart);
        }
        return true;
      }
    }
    return false;
  }
}

// 折叠处理器
class CollapseHandler extends Handler {
  canHandle(editor: Editor): boolean {
    const { $anchor } = editor.state.selection;

    // 向上查找 Collapse 节点
    for (let depth = $anchor.depth; depth > 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === "collapse") {
        return true;
      }
    }
    return false;
  }

  handle(editor: Editor): boolean {
    const { selection } = editor.state;
    const { $anchor } = selection;

    // 找到 Collapse 节点
    for (let depth = $anchor.depth; depth > 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === "collapse") {
        // 获取节点的起始位置
        const start = $anchor.start(depth);
        // 获取节点内容的起始位置
        const contentStart = start;
        // 获取节点内容的结束位置
        const contentEnd = $anchor.end(depth);

        // 检查当前选择是否已经是 Collapse 的全部内容
        const currentFrom = selection.from;
        const currentTo = selection.to;
        if (currentFrom === contentStart && currentTo === contentEnd) {
          // 如果已经选中全部内容，交给下一级处理
          return false;
        }

        // 确保选择范围有效
        if (contentEnd > contentStart) {
          // 选择 Collapse 内的内容（不包括节点本身）
          editor.commands.setTextSelection({ from: contentStart, to: contentEnd });
        } else {
          // 如果内容为空，将光标放在内容开始位置
          editor.commands.setTextSelection(contentStart);
        }
        return true;
      }
    }
    return false;
  }
}

// 创建责任链
const codeBlockHandler = new CodeBlockHandler();
const collapseHandler = new CollapseHandler();

codeBlockHandler.setNext(collapseHandler);

export const SelectAllExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-a": ({ editor }) => {
        return codeBlockHandler.handleRequest(editor);
      },
    };
  },
});

