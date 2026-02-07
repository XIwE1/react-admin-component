import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Dropdown } from "antd";
import "./index.less";
import NavigateItem from "./NavigateItem.jsx";
import {
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const LANG_ZH_CN = "zh-CN";
const LANG_EN_US = "en-US";

const Header = (props) => {
  const { title } = props;
  const { t, i18n } = useTranslation("common");

  const langMenuItems = useMemo(
    () => [
      {
        key: LANG_ZH_CN,
        label: t("language.zhCN"),
      },
      {
        key: LANG_EN_US,
        label: t("language.enUS"),
      },
    ],
    [t]
  );

  const handleMenuClick = ({ key }) => {
    i18n.changeLanguage(key);
  };

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
        <Dropdown
          menu={{
            items: langMenuItems,
            onClick: handleMenuClick,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="avatar header-lang-trigger">
            <GlobalOutlined />
          </div>
        </Dropdown>
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
