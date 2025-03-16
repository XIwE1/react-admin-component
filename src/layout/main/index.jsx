import "./index.less";
import Config from "@/pages/config";
import Form1 from "@/pages/form_1";
import Form2 from "@/pages/form_2";

const componentMap = {
  Config: Config,
  Form_1: Form1,
  Form_2: Form2,
};

const Main = (props) => {
  const { active } = props;

  const renderContent = (key) => {
    if (!key) return <>empty content</>;
    const Component = componentMap[key];
    return Component ? <Component /> : <>invalid content</>;
  };
  
  return <div className="main">{renderContent(active)}</div>;
};

export default Main;
