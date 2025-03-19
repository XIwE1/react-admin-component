import Form from "antd/es/form";
import React from "react";
import FormItem from "./components/FormItem";
import { FormSchemaItem } from "./Form.types";

const IForm = (props) => {
  const { schemaItems, fieldValues } = props;
  const [formInstance] = Form.useForm();

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
      {schemaItems?.map((item: FormSchemaItem) => renderFormItem(item))}
    </Form>
  );
};

export default IForm;
