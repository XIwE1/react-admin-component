import Form from "antd/es/form";
import React from "react";
import FormItem from "./components/FormItem";
import { FormSchemaItem } from "./Form.types";

const IForm = (props) => {
  const { schemaItems, fieldValues } = props;
  const [formInstance] = Form.useForm();

  const renderFormItem = (item: FormSchemaItem) => {
    return <FormItem {...item} />;
  };

  return (
    <Form form={formInstance}>
      {schemaItems.map((item) => renderFormItem(item))}
    </Form>
  );
};

export default IForm;
