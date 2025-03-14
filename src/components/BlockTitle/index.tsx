import React from "react";
import "./index.css";

type BlockTitleProps = {
  title?: string;
  //   fontSize?: string;
  //   color?: string;
};

const BlockTitle = (props: BlockTitleProps) => {
  const { title } = props;

  return (
    <div className="block_title">
      <span className="content">{title}</span>
    </div>
  );
};

export default BlockTitle;
