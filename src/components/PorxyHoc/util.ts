import type { SchemaReaction } from "@/components/Form/Form.types.js";

// 1. schema reactions（dependencies 依赖/target 目标 字段 + when?条件语句 + fulfill/otherwise 副作用） ->
// 2. transform -> token 拆解 出依赖/目标 ->
// 3. when+fulfill/otherwise 在依赖/目标上注册回调

$self;
$deps;
$target;

const rawExpr = expr.replace(/^{{|}}$/g, '');

const source = ReactiveData;
if (when) {
} else {
}

const isFulfill = fulfill;
if (isFulfill) {
} else if (otherwise) {
}

function resolveReaction(reaction: SchemaReaction) {}

// [
//   {
//     when: "{{$self.value == '123'}}",
//     target: "target",
//     fulfill: {
//       state: {
//         visible: true,
//         value: '{{$deps[0] * $deps[1]}}',
//       },
//     },
//     otherwise: {
//       state: {
//         visible: false,
//       },
//     },
//   },
// ];
