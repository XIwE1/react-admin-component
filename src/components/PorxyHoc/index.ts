import type {
  SchemaReaction,
  FormSchemaItem,
} from "@/components/Form/Form.types.ts";
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
  constructor(instance: FormInstance, schemas: FormSchemaItem[]) {
    console.log("proxyFormInstance constructor");

    this.formInstance = instance;
    // this.formInstance = new Proxy(instance, {
    //   set: (target, key, value) => {
    //     Reflect.set(target, key, value);
    //     this.trigger(key);
    //     return true;
    //   },
    // });
    // 解析reaction，得到依赖项/影响目标，在发布订阅中心中注册回调
    for (let schemaItem of schemas) {
      if (!schemaItem.reactions) continue;
      const { reactions } = schemaItem;
      const self = schemaItem.field_key;
      for (let reaction of reactions) {
        const { dependencies, target } = reaction;
        console.log("proxyFormInstance reaction", dependencies, target);
        const _reaction = { ...reaction, self };
        if (dependencies && dependencies.length) {
          // 回调：when+fulfill/otherwise 组成的一个函数
          for (const dep of dependencies) {
            this.registerCallBack(dep, _reaction, (context) => {
              this.executeCallBack(context, reaction);
            });
          }
        }

        if (target) {
          console.log("target", target);

          this.registerCallBack(schemaItem.field_key, _reaction, (context) => {
            console.log("executeCallBack");

            this.executeCallBack(context, reaction);
          });
        }
      }
    }
  }
  trigger(propKeys: string | symbol | string[]) {
    console.log("trigger - propKeys", propKeys);
    const _propKeys = Array.isArray(propKeys) ? propKeys : [propKeys];
    for (const propKey of _propKeys) {
      console.log("trigger - propKey", propKey);
      const target = this.deps.get(propKey);
      console.log("trigger - target", target);
      const callBacks = target?.callbacks ? target.callbacks : [];
      for (const item of callBacks) {
        const { reaction, fn: callBack } = item;
        const context = buildContext(this.formInstance, reaction);
        callBack(context);
      }
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
    console.log("registerCallBack", propKey, reaction);

    if (!this.deps.has(propKey)) {
      this.deps.set(propKey, { callbacks: [] });
    }
    const target = this.deps.get(propKey);
    target?.callbacks?.push({ reaction, fn: callBack });
    console.log("this.deps", this.deps);
  }
  /**
   * 执行回调函数，
   */
  executeCallBack(context: any, reaction: SchemaReaction) {
    const { $depends, $self, $target } = context;
    console.log("executeCallBack", $depends, $self, $target);
    console.log("executeCallBack reaction.when", reaction.when);

    const whenCallBack = parser.parse(removeSymbol(reaction.when) || "true");
    // // 执行时传入受控变量
    // const result = whenCallBack.evaluate({
    //   $depends: [
    //     /* ... */
    //   ],
    //   $self: { value: 42 },
    //   $target: { value: 100 },
    // });
    // 判断执行fulfill or otherwise
    let isFulfill = whenCallBack.evaluate({ $depends, $self, $target });
    console.log("executeCallBack isFulfill", isFulfill);

    // 存在target - 主动影响，否则 更新self - 被动依赖
    const targetProp = reaction.target ? $target.name : $self.name;
    let reactionState = reaction.fulfill.state;
    if (!isFulfill) {
      if (!reaction.otherwise?.state) return;
      reactionState = reaction.otherwise.state;
    }
    console.log("executeCallBack reactionState", reactionState);

    for (let [prop, express] of Object.entries(reactionState)) {
      const callBack = parser.parse(removeSymbol(express as string));
      const callBackValue = callBack.evaluate({ $depends, $self, $target });
      // 假设prop为value
      this.formInstance.setFieldValue(targetProp, callBackValue);
    }
  }
}

/**
 * 根据 reaction，从 instance 中提取出目标属性值
 * 构建context 提供给Callback
 * @param instance 表单实例formInstance
 * @param reaction 依赖配置reaction
 * @returns context Callback执行的上下文
 */
function buildContext(instance: FormInstance, reaction: SchemaReaction) {
  const { dependencies, target, self } = reaction;

  const $depends = dependencies?.map((propKey: string) =>
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

function removeSymbol(str: string) {
  return str.replace(/\{\{(.*?)\}\}/g, "$1");
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

// 还有一种方式是解析reaction，给Field.Item 设置 dependencies，
// 主动影响，在item上设置onChange 改变target的hidden disable value ...
// 被动依赖，在target上设置onChange 改变self的hidden disable value...
// 需要重新renderFieldItem，并在执行renderFieldItem前 构建出一个deps:Map结构，Record<field_key: string, callBacks: { fn: Function, source_key: string }[]>

// onChange时调用deps对应的field_key 执行Callback -> fn，Callback需要计算{ $self, $depends, $target}等上下文。

// 通过source_key去获取对应的reaction，根据表单实例formInstance和传入的SchemaItem配置，
// 构建出 $self { name: 'count', value: 10, hidden: true, disabled: true } 等结构

// fn执行 when: string -> whenCallback: Function，isFulfill = whenCallback() ，fulfill: { state: { visible, value, display... } }
// 遍历state对象 生成 更新目标属性prop和表达式语句express，isFulfill ? express = fulfill : express = otherwise
// express -> expressCallback: Function，express_value = expressCallback({ $self, $depends, $target })

// 主动影响（$target !== null）：prop !== value ? SchemaItem.[target].[prop] = express_value : formInstance.setFieldValue(target, value)
// 被动依赖（$target === null && $depends）SchemaItem.[source_key].[prop] = express_value ：formInstance.setFieldValue(source_key, value)

export default ProxyFormInstance;
