import Form from "antd/es/form";
import React, { useEffect } from "react";
import FormItem from "./components/FormItem";
import { FormSchemaItem } from "./Form.types";
import dayjs from "dayjs";
import { formatValueByType } from "@/utils";

export interface IFormProps {
  schemaItems: FormSchemaItem[];
  fieldValues: any;
}

const IForm = (props: IFormProps) => {
  const { schemaItems, fieldValues } = props;
  const [formInstance] = Form.useForm();

  const [cloneSchemaItems, setCloneSchemaItems] = React.useState([] as FormSchemaItem[]);

  useEffect(() => {
    const cloneItems = schemaItems.map((item) => ({
      ...item,
      defaultValue: formatValueByType(item.type, item.defaultValue),
    }));
    setCloneSchemaItems(cloneItems);
  }, [schemaItems]);

  formInstance.setFieldsValue(fieldValues);

  const renderFormItem = (item: FormSchemaItem) => {
    const itemProps = {
      ...item,
    };
    return <FormItem {...itemProps} key={item.field_key} />;
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      // wrapperCol={{ span: 16 }}
      // style={{ maxWidth: 600 }}
      // form={formInstance}
    >
      {cloneSchemaItems?.map((item: FormSchemaItem) => renderFormItem(item))}
    </Form>
  );
};

export default IForm;
