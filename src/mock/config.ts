import { ConfigItemType, FormSchemaItem } from "@/store/configStore";

export const mock_dataSource: FormSchemaItem[] = [
  {
    field_key: "goods",
    field: "商品",
    type: "input",
    defaultValue: "显示器",
    disabled: false,
    hidden: false,
  },
  {
    field_key: "type",
    field: "商品类型",
    type: "radio",
    defaultValue: 3,
    disabled: false,
    hidden: false,
    componentProps: {
      options: [
        { label: "化工产品", value: 1 },
        { label: "医疗制剂", value: 2 },
        { label: "机械设备", value: 3 },
        { label: "灯具空调", value: 4 },
      ],
    },
  },
  {
    field_key: "money",
    field: "金额",
    type: "number",
    defaultValue: 100,
    disabled: false,
    hidden: false,
    reactions: "count,price",
    tooltip: "总花费金额",
  },
  {
    field_key: "price",
    field: "单价",
    type: "number",
    defaultValue: 10,
    disabled: true,
    hidden: false,
    reactions: "money,price",
    extra: "采购时的价格",
  },
  {
    field_key: "count",
    field: "数量",
    type: "number",
    defaultValue: 10,
    disabled: false,
    hidden: false,
    tooltip: "购入的总数量",
  },
  {
    field_key: "department",
    field: "部门",
    type: "select",

    defaultValue: ["tech"],
    disabled: false,
    hidden: false,
    componentProps: {
      mode: "multiple",
      options: [
        { label: "技术部", value: "tech" },
        { label: "销售部", value: "sales" },
        { label: "财务部", value: "finance" },
        { label: "行政部", value: "govern" },
      ],
    },
  },
  {
    field_key: "describe",
    field: "用途",
    type: "input",
    defaultValue: "业务采购",
    disabled: false,
    hidden: false,
  },
  {
    field_key: "date",
    field: "申请日期",
    type: "date",
    defaultValue: "2025-03-21",
    disabled: false,
    hidden: false,
  },
  {
    field_key: "range",
    field: "有效时间",
    type: "range",
    defaultValue: ["2025-03-21", "2026-03-21"],
    disabled: false,
    hidden: false,
  },
  {
    field_key: "valid",
    field: "票据",
    type: "upload",
    defaultValue: "",
    disabled: false,
    hidden: false,
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
