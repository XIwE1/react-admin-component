import DynamicForm from "@/components/DynamicForm";
import { useConfigStore } from "@/store/configStore";

import { message } from "antd";

const TARGET_CONFIG_KEY = "form1";

const Form1 = (props) => {
  const { configs } = useConfigStore();

  const config = configs.find((item) => item.key === TARGET_CONFIG_KEY);

  const submitFormAPI = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  const handleSubmit = async (value) => {
    // 模拟提交数据
    const success = await submitFormAPI(value);
    if (success) message.success("提交成功");
    return success;
  };

  return <DynamicForm config={config} onSubmit={handleSubmit}  />;
};

export default Form1;
