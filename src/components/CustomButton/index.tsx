import { Button, ButtonProps } from "antd";
import React from "react";
import { Permission } from "../Permission";
import { intentVariants, sizeVariants, buttonVariants } from "../../styles/variants";
import clsx from "clsx";

interface CustomButtonProps extends ButtonProps {
  variant?: keyof typeof intentVariants;
  size?: keyof typeof sizeVariants;
  className?: string;
}

interface CustomButtonWithPermissionProps extends CustomButtonProps {
  permission?: string[];
}

export function CustomButton(props: CustomButtonProps) {
  const { variant = "default", size = "medium", className, ...rest } = props;
  const variantClass = buttonVariants({ intent: variant, size: size });
  return <button className={clsx(variantClass, className)} {...rest} />;
}

export default function (props: CustomButtonWithPermissionProps) {
  const { permission, ...rest } = props;
  return (
    <Permission
      permission={permission}
      fallback={<CustomButton {...rest} disabled />}
    >
      <CustomButton {...rest} />
    </Permission>
  );
}
