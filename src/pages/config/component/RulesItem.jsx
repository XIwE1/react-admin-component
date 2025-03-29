import { PRESET_RULES } from "@/constants/config";
import { PlusOutlined } from "@ant-design/icons";
import { TYPE_RULES_MAP } from "@/constants/type";
import { Form, InputNumber, Select, Space, Button } from "antd";

const RulesItem = (props) => {
  const { type, rules } = props;

  const getAvailableRules = (type) => {
    const allowerRuleType = TYPE_RULES_MAP[type] || [];
    const rules = Object.entries(PRESET_RULES).reduce((res, cur, idx) => {
      const [type, value] = cur;
      const ruleItem = { type, ...value };
      if (allowerRuleType.includes(type)) res.push(ruleItem);
      return res;
    }, []);
    return rules;
  };

  const renderHeaderSide = (listItem, availableRules) => {
    return (
      <Form.Item noStyle name={[listItem.name, "type"]}>
        <Select
          placeholder="选择校验类型"
          options={availableRules.map((ruleItem) => ({
            label: ruleItem.label,
            value: ruleItem.type,
            help: ruleItem.description,
          }))}
        ></Select>
      </Form.Item>
    );
  };

  const renderMainSide = (listItem, ruleType) => {
    if (ruleType) {
      if (ruleType === "length") {
        return (
          <>
            <Form.Item noStyle name={[listItem.name, "min"]}>
              <InputNumber min={0} placeholder="最小长度"></InputNumber>
            </Form.Item>
            <Form.Item noStyle name={[listItem.name, "max"]}>
              <InputNumber placeholder="最大长度"></InputNumber>
            </Form.Item>
          </>
        );
      } else if (ruleType === "multipleLimit") {
        return (
          <>
            <Form.Item noStyle name={[listItem.name, "min"]}>
              <InputNumber min={0} placeholder="最小数量"></InputNumber>
            </Form.Item>
            <Form.Item noStyle name={[listItem.name, "max"]}>
              <InputNumber placeholder="最大数量"></InputNumber>
            </Form.Item>
          </>
        );
      }
    }
    return <></>;
  };

  const renderRuleItem = (item, index, remove) => {
    const ruleType = rules[index]?.type;
    const availableRules = getAvailableRules(type);

    const HeadSide = renderHeaderSide(item, availableRules);
    const MainSide = renderMainSide(item, ruleType);

    return (
      <>
        {HeadSide}
        {MainSide}
        <Button type="link" danger onClick={() => remove(item.name)}>
          删除
        </Button>
      </>
    );
  };

  return (
    <>
      <Form.Item key="rules" label="校验规则">
        <Form.List name="rules">
          {(rules, { add, remove }) => (
            <>
              {rules.map((item, index) => {
                return (
                  <Space key={index} style={{ marginBottom: 8 }}>
                    {renderRuleItem(item, index, remove)}
                  </Space>
                );
              })}
              <Button
                block
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add()}
              >
                添加规则
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
    </>
  );
};

export default RulesItem;
