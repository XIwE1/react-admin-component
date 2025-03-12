import { FormInstance, Rule } from "antd/es/form";

/**
 * 字段类型
 */
type FormItemType =
  | "input" // 输入框
  | "password" // 密码框
  | "textarea" // 文本域
  | "number" // 数字输入框
  | "select" // 下拉框
  | "checkbox" // 多选框
  | "radio" // 单选框
  | "date" // 日期选择
  | "range" // 日期范围
  | "switch" // 开关
  | "upload" // 文件上传
  | "custom"; // 自定义组件

/**
 * 选项类型
 */
interface FormItemOption {
  label: string;
  value: any;
}

/**
 * Schema 字段联动的配置协议
 * 如果 reaction 对象里包含 target，则代表主动联动模式，否则代表被动联动模式
 */
type SchemaReaction =
  | {
      dependencies?: //依赖的字段路径列表，支持FormPathPattern数据路径语法, 只能以点路径描述依赖，支持相对路径
      | Array<
            | string //如果数组里是string，那么读的时候也是数组格式
            | {
                //如果数组里是对象, 那么读的时候通过name从$deps获取
                name?: string; //从$deps读取时的别名
                type?: string; //字段类型
                source?: string; //字段路径
                property?: string; //依赖属性, 默认为value
              }
          >
        | Record<string, string>; //如果是对象格式，读的时候也是对象格式，只是对象的key相当于别名
      when?: string | boolean; // 联动条件
      target?: string; // 主动影响的字段
      fulfill?: {
        //满足条件
        state?: Record<string, any>; //更新状态
        schema?: Record<string, any>; //更新Schema
        run?: string; //执行语句
      };
      otherwise?: {
        //不满足条件
        state?: Record<string, any>;
        schema?: Record<string, any>;
        run?: string;
      };
    }
  | ((field: any) => void); //支持函数, 可以复杂联动;

type SchemaReactions = SchemaReaction | SchemaReaction[]; //支持传入数组

/**
 * 表单项类型
 */
export interface FormSchemaItem {
  type: FormItemType;
  name: string;
  label: string;
  defaultValue?: any;
  // options?: FormItemOption[];
  // placeholder?: string;
  // path?: string[];
  disabled?: boolean;
  hidden?: boolean;
  rules?: Rule[];
  suffix?: React.ReactNode;
  tooltip?: string | { title: string; icon?: React.ReactNode };
  componentProps?: Record<string, any>; // 透传给antd组件的属性，如placeholder、options
  customRender?: (
    form: FormInstance,
    formData: Record<string, any>
  ) => React.ReactNode; // 自定义渲染
  reactions?: SchemaReactions; // 配置字段联动
}

/**
 * 表单配置项
 */
export interface FormOptions {
  labelWidth?: string;
  itemStyle?: any;
  layout?: {
    labelCol?: { span: number };
    wrapperCol?: { span: number };
    style?: React.CSSProperties;
  };
}
