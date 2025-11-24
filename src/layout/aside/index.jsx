import "./index.less";
import { GithubOutlined } from "@ant-design/icons";

const Aside = ({ props, children }) => {
  const jumpToGitHub = () => window.open("https://github.com/XIwE1");

  return (
    <div className="aside">
      <div className="title" onClick={jumpToGitHub}>
        <div className="">
          <GithubOutlined /> Admin v0.3.6
        </div>
      </div>
      <div className="list_container">{children}</div>
    </div>
  );
};

export default Aside;
