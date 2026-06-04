import { Button, ButtonProps } from "antd";
import React from "react";
import { WithPermission } from "../Permission";

const buttonVariants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 !important",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  info: "bg-blue-500 text-white hover:bg-blue-600",
  link: "text-blue-500 hover:text-blue-600",
  ghost: "bg-transparent text-black hover:bg-gray-100",
  dashed:
    "border-dashed border-gray-500 text-gray-500 hover:border-gray-600 hover:text-gray-600",
  text: "text-black hover:text-gray-600",
  default: "bg-gray-500 text-white hover:bg-gray-600",
};

interface CustomButtonProps extends ButtonProps {
  customVariant?: keyof typeof buttonVariants;
}

interface CustomButtonWithPermissionProps extends CustomButtonProps {
  permission?: string[];
}

export function CustomButton(props: CustomButtonProps) {
  const { customVariant = "default", ...rest } = props;
  return <Button className={buttonVariants[customVariant]} {...rest} />;
}

export default function (props: CustomButtonWithPermissionProps) {
  const { permission, ...rest } = props;
  return (
    <WithPermission
      permission={permission}
      fallback={<CustomButton {...rest} disabled />}
    >
      <CustomButton {...rest} />
    </WithPermission>
  );
}
