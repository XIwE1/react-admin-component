import Form, { FormInstance } from "antd/es/form";
import React, {
  useImperativeHandle,
  useEffect,
  useState,
  forwardRef,
} from "react";
import FormItem from "./components/FormItem";
import { FormSchemaItem } from "./Form.types";
import { formatValueByType } from "@/utils";

export interface IFormProps {
  schemaItems: FormSchemaItem[];
  fieldValues: any;
}

export interface IFormRef {
  formInstance: FormInstance;
  resetFields: () => void;
}

const IForm = (props: IFormProps, ref: React.Ref<unknown> | undefined) => {
  const { schemaItems, fieldValues } = props;
  const [cloneSchemaItems, setCloneSchemaItems] = useState(
    [] as FormSchemaItem[]
  );

  const [formInstance] = Form.useForm();
  formInstance.setFieldsValue(fieldValues);

  useImperativeHandle(ref, () => ({
    formInstance,
    resetFields: () => formInstance.resetFields(),
    getFieldsValue: () => formInstance.getFieldsValue(),
  }));

  useEffect(() => {
    const cloneItems = schemaItems.map((item) => ({
      ...item,
      defaultValue: formatValueByType(item.type, item.defaultValue),
    }));
    setCloneSchemaItems(cloneItems);
  }, [schemaItems]);

  const renderFormItem = (item: FormSchemaItem) => {
    const itemProps = {
      ...item,
    };
    return <FormItem {...itemProps} key={item.field_key} />;
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      labelWrap
      form={formInstance}
      // wrapperCol={{ span: 16 }}
    >
      {cloneSchemaItems?.map((item: FormSchemaItem) => renderFormItem(item))}
    </Form>
  );
};

export default forwardRef(IForm);
