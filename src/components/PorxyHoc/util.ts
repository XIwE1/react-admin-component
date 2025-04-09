import type {
  SchemaReaction,
  FormSchemaItem,
} from "@/components/Form/Form.types.js";
import { FormInstance } from "antd";
import { Parser } from "expr-eval";

const parser = new Parser();

// 1. schema reactions（dependencies 依赖/target 目标 字段 + when?条件语句 + fulfill/otherwise 副作用） ->
// 2. transform -> token 拆解 出依赖/目标 ->
// 3. when+fulfill/otherwise 在依赖/目标上注册回调
// 模板解析 + 依赖管理

type CallBackItem = {
  reaction: SchemaReaction;
  fn: Function;
};
type DepsValue = {
  value?: any;
  display?: any;
  children?: DepsValue[];
  callbacks?: CallBackItem[];
  [key: string]: any;
};

class ProxyFormInstance {
  formInstance: FormInstance;
  deps: Map<string | symbol, DepsValue> = new Map();

  // const reaction: SchemaReaction = {
  //   when: "{{$self.value == 123}}",
  //   dependencies: ["count"],
  //   target: "targetField",
  //   fulfill: {
  //     state: {
  //       value:
  //         "{{$deps[0] !== undefined ? $self.value * $deps[0] : $target.value}}",
  //     },
  //   },
  // };
  constructor(instance: any, schemas: FormSchemaItem[]) {
    this.formInstance = new Proxy(instance, {
      set: (target, key, value) => {
        Reflect.set(target, key, value);
        this.trigger(key, value);
        return true;
      },
    });
    // 解析reaction，得到依赖项/影响目标，在发布订阅中心中注册回调
    for (let schemaItem of schemas) {
      if (!schemaItem.reactions) continue;
      const { reactions } = schemaItem;
      const self = schemaItem.field_key;
      for (let reaction of reactions) {
        const { dependencies, target } = reaction;
        if (dependencies && dependencies.length) {
          for (const dep of dependencies) {
            this.registerCallBack(dep, { ...reaction, self }, (context) => {
              updateCallBack(context, reaction);
            });
          }
        }

        if (target) {
          this.registerCallBack(
            schemaItem.field_key,
            { ...reaction, self },
            (context) => {
              updateCallBack(context, reaction);
            }
          );
        }
      }
    }
  }
  trigger(propKey: string | symbol, value: any) {
    const target = this.deps.get(propKey);
    const callBacks = target?.callbacks ? target.callbacks : [];
    for (const item of callBacks) {
      const { reaction, fn: callBack } = item;
      const context = buildContext(this.formInstance, reaction);
      callBack(context);
    }
  }

  // depends - 被动依赖 和 target - 主动影响，可能同时存在
  // const context = {
  // $self: { value: 123 }, // 假设当前字段值为123
  // $deps: [10], // data.count = 10
  // $target: { value: "default" }, // 假设目标字段当前值
  // };
  registerCallBack(
    propKey: string,
    reaction: SchemaReaction,
    callBack: Function
  ) {
    if (!this.deps.has(propKey)) {
      this.deps.set(propKey, { callbacks: [] });
    }
    const target = this.deps.get(propKey);
    target?.callbacks?.push({ reaction, fn: callBack });
  }
}

function buildContext(instance: FormInstance, reaction: SchemaReaction) {
  const { dependencies, target, self } = reaction;

  const $depends = dependencies.map((propKey: string) =>
    instance.getFieldValue(propKey)
  );
  const $self = {
    name: self,
    value: instance.getFieldValue(self),
  };
  const $target = {
    name: target,
    value: instance.getFieldValue(target),
  };
  const context = { $depends, $self, $target };
  return context;
}
// 回调：when+fulfill/otherwise 组成的一个函数

/**
 * 根据表达式生成更新函数，更新self - 被动依赖，更新target - 主动影响
 */
function updateCallBack(context: any, reaction: SchemaReaction) {
  const { $depends, $self, $target } = context;
  const newState = Object.create({});
  const whenCallBack = parser.parse(reaction.when);
  // // 执行时传入受控变量
  // const result = whenCallBack.evaluate({
  //   $depends: [
  //     /* ... */
  //   ],
  //   $self: { value: 42 },
  //   $target: { value: 100 },
  // });
  // 判断执行fulfill or otherwise
  let isFulfill = reaction.when
    ? whenCallBack.evaluate({ $depends, $self, $target })
    : true;
  if (isFulfill) {
    for (let [prop, express] of reaction.fulfill.state) {
      const fulfillCallBack = parser.parse(express);
      newState[prop] = fulfillCallBack.evaluate({ $depends, $self, $target });
    }
  } else if (reaction.otherwise) {
    for (let [prop, express] of reaction.otherwise.state) {
      const otherwiseCallBack = parser.parse(express);
      newState[prop] = otherwiseCallBack.evaluate({ $depends, $self, $target });
    }
  }
}

function getTargetByPath(source: Record<string, any>, path: string) {
  if (!path) return source;
  return source[path] || "";
  // TODO：解析string[] 格式的path
  // if (path.length === 1) return source[path[0]];
  // return getTargetByPath(source[path[0]], path.slice(1));
}

function effectTarget(namePath: string | string[], state: any) {
  const { value, display } = state;
  const targetPath = Array.isArray(namePath) ? namePath : [namePath];
}

function resolveReaction(reaction: SchemaReaction) {}

// [
//   {
//     when: "{{$self.value == '123'}}",
//     dependencies: ['count'],
//     target: "target",
//     fulfill: {
//       state: {
//         visible: true,
//         value: '{{$deps[0] * $deps[1]}}',
//         value: '{{$deps[0] !== undefined ? $self.value * $deps[0] : $target.value}}',
//         display: '{{$self.value}}',
//       },
//     },
//     otherwise: {
//       state: {
//         visible: false,
//       },
//     },
//   },
// ];
