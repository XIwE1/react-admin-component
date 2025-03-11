import "./index.less";

const NavigateItem = (props) => {
  const { name, path, icon, disable, isActive, isLast } = props;

  return (
    <>
      <span className={`navigate_item ${isActive ? "active" : ""}`}>
        {icon} {name}
      </span>
      <span>{isLast ? "" : "/"}</span>
    </>
  );
};

export default NavigateItem;
