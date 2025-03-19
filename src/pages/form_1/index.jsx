import IForm from "@/components/Form";
import BlockTitle from "@/components/BlockTitle";
import "./index.css";
import { useConfigStore } from "@/store/configStore";
import { Button } from "antd";

const TARGET_CONFIG_KEY = "form1";

const Form1 = () => {
  const { configs } = useConfigStore();
  const config = configs.find((item) => item.key === TARGET_CONFIG_KEY);
  const configSchemas = config.data;

  return (
    <div className="form_container">
      <BlockTitle title={config.title} />
      <div className="form_content">
        <IForm schemaItems={configSchemas} />
        <div className="content_footer">
            <Button>重置</Button>
            <Button type="primary">提交</Button>
        </div>
      </div>
    </div>
  );
};

export default Form1;
