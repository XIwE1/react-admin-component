import Form from "antd/es/form";
import React from "react";
import FormItem from "./components/FormItem";
import { FormSchemaItem } from "./Form.types";

const IForm = (props) => {
  const { schemaItems, fieldValues } = props;
  const [formInstance] = Form.useForm();

  const renderFormItem = (item: FormSchemaItem) => {
    const itemProps = {
      ...item,
      label: item.field,
      fieldName: item.key,
    };
    return <FormItem {...itemProps} key={item.key} />;
  };

  return (
    <Form
      // labelCol={{ span: 8 }}
      // wrapperCol={{ span: 16 }}
      // style={{ maxWidth: 600 }}
      form={formInstance}
    >
      {schemaItems?.map((item) => renderFormItem(item))}
    </Form>
  );
};

export default IForm;
