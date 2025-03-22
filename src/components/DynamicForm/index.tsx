import { Button, Popconfirm } from "antd";
import React, { useRef, useState } from "react";

import { ConfigItemType } from "@/store/configStore";
import IForm, { IFormRef } from "@/components/Form";
import BlockTitle from "@/components/BlockTitle";

import "./index.css";

export interface DynamicFormProps {
  config: ConfigItemType;
  isPreview?: boolean;
  onSubmit?: (value: Record<string, any>) => Promise<any>;
}

const DynamicForm = (props: DynamicFormProps) => {
  const { onSubmit, config, isPreview } = props;
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<IFormRef>(null);

  const configSchemas = config.data;

  const handleReset = () => {
    formRef.current?.resetFields();
  };
  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit?.(formRef.current?.getFieldsValue() || {});
    setLoading(false);
  };

  return (
    <div className="form_container">
      <BlockTitle title={config.title} />
      <div className="form_content">
        <IForm ref={formRef} schemaItems={configSchemas} />
        <div className="content_footer">
          {!isPreview && (
            <>
              <Popconfirm
                title={<span>确定要重置表单吗？</span>}
                onConfirm={handleReset}
                okText="确定"
                cancelText="取消"
              >
                <Button>重置</Button>
              </Popconfirm>
              <Button loading={isLoading} type="primary" onClick={handleSubmit}>
                提交
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
