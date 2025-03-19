import IForm from "@/components/Form";
import BlockTitle from "@/components/BlockTitle";
import "./index.css";
import { useConfigStore } from "@/store/configStore";

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
      </div>
    </div>
  );
};

export default Form1;
