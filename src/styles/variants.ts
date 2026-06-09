import { cva } from "class-variance-authority";

export const sizeVariants = {
  small: "text-sm px-2 py-1",
  medium: "text-base px-4 py-2",
  large: "text-lg px-6 py-3",
};

export const intentVariants = {
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

export const buttonVariants = cva(
  "rounded-md cursor-pointer transition-all duration-300",
  {
    variants: {
      size: sizeVariants,
      intent: intentVariants,
    },
  },
);
