import { Avatar } from "antd";
import "./index.less";
import NavigateItem from "./NavigateItem.jsx";
import {
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Header = (props) => {
  const { title } = props;

  const navigateItems = [
    { name: "Home", icon: <HomeOutlined /> },
    { name: title, isActive: true },
  ];

  const renderNavigateItems = (items) => {
    const last = items.length - 1;
    return items.map((item, index) => {
      const isLast = index === last;
      const itemNode = (
        <NavigateItem key={item.name} index={index} isLast={isLast} {...item} />
      );
      return itemNode;
    });
  };

  return (
    <div className="header">
      <div className="left">
        <div className="expand">
          <MenuFoldOutlined />
        </div>
        <div className="navigate"> {renderNavigateItems(navigateItems)} </div>
      </div>
      <div className="right">
        <div className="avatar">
          <Avatar size={26} icon={<UserOutlined />}></Avatar>
        </div>
        <div className="avatar">
          <SettingOutlined />
        </div>
      </div>
    </div>
  );
};

export default Header;
