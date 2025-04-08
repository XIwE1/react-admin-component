import type { SchemaReaction } from "@/components/Form/Form.types.js";

// 1. schema reactions（dependencies 依赖/target 目标 字段 + when?条件语句 + fulfill/otherwise 副作用） ->
// 2. transform -> token 拆解 出依赖/目标 ->
// 3. when+fulfill/otherwise 在依赖/目标上注册回调
// 模板解析 + 依赖管理

type DepsValue = {
  value?: any;
  display?: any;
  children?: DepsValue[];
  callbacks?: Function[];
  [key: string]: any;
};

const deps = new Map<string, DepsValue>();

const reaction: SchemaReaction = {
  when: "{{$self.value == 123}}",
  dependencies: ["count"],
  target: "targetField",
  fulfill: {
    state: {
      value:
        "{{$deps[0] !== undefined ? $self.value * $deps[0] : $target.value}}",
    },
  },
};

// depends - 被动依赖 和 target - 主动影响，可能同时存在
// const context = {
// $self: { value: 123 }, // 假设当前字段值为123
// $deps: [10], // data.count = 10
// $target: { value: "default" }, // 假设目标字段当前值
// };
$self;
$deps;
$target;

// 解析reaction，得到依赖项/影响目标，在发布订阅中心中注册回调
// 回调：when+fulfill/otherwise 组成的一个函数
const { dependencies, target } = reaction;

if (dependencies && dependencies.length) {
  for (const dep of dependencies) {
    registerCallBack(dep, () => {});
  }
}

if (target) {
  registerCallBack($self.name, () => {});
}

function registerCallBack(propKey: string | string[], callBack: Function) {
  const namePath = Array.isArray(propKey) ? propKey : [propKey];
}

function trigger(propKey: string, value: any) {
  const target = deps.get(propKey);
  const callBacks = target?.callbacks ? target.callbacks : [];
  for (const callBack of callBacks) {
    callBack(value);
  }
}

// 判断执行fulfill or otherwise
let isFulfill = reaction.when ? eval(reaction.when) : true;

// 根据表达式生成更新函数，更新self - 被动依赖，更新target - 主动影响
function generateUpdateCallBack() {
  const newState = Object.create({});
  if (isFulfill) {
    for (let [prop, express] of reaction.fulfill.state) {
      newState[prop] = eval(express);
    }
    effectTarget(reaction.target, newState);
  } else if (reaction.otherwise) {
    for (let [prop, express] of reaction.otherwise.state) {
      newState[prop] = eval(express);
    }
    effectTarget(reaction.target, newState);
  }
}

function findTargetByPath(source: any, path: string[]) {
  if (!path) return source;
  if (path.length === 1) return source[path[0]];
  return findTargetByPath(source[path[0]], path.slice(1));
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
