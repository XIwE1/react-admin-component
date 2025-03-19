import { ConfigItemType, FormSchemaItem } from "@/store/configStore";

export const mock_dataSource: FormSchemaItem[] = [
  {
    field_key: "money",
    field: "金额",
    type: "number",
    defaultValue: 100,
    disabled: false,
    hidden: false,
    reactions: "count,price",
  },
  {
    field_key: "price",
    field: "单价",
    type: "number",
    defaultValue: 10,
    disabled: false,
    hidden: false,
    reactions: "money,price",
  },
];

export const mock_configs: ConfigItemType[] = [
  {
    key: "form1",
    title: "动态表单Form_1",
    data: mock_dataSource,
    createAt: "2025-03-14",
    lastUpdateAt: "2025-03-15",
    // ...模拟后端返回的数据
  },
  {
    key: "form2",
    title: "动态表单Form_2",
    data: mock_dataSource,
    createAt: "2025-03-15",
    lastUpdateAt: "2025-03-15",
  },
];
