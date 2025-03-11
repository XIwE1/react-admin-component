import "./index.less";
import { DesktopOutlined } from "@ant-design/icons";

const Aside = ({ props, children }) => {
  return (
    <div className="aside">
      <div className="title"><DesktopOutlined /> 后台系统Demo</div>
      <div className="list_container">{children}</div>
    </div>
  );
};

export default Aside;
