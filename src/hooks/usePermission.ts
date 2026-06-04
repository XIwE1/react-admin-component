import { usePermissionStore } from "../store/permissionStore";
import React from "react";

interface UsePermissionProps {
  permission?: string[];
}

export default function usePermission(props: UsePermissionProps): boolean {
  const { permission } = props;

  const { permissions, isAdmin } = usePermissionStore();

  if (!permission) return true;

  if (isAdmin) return true;

  const hasPermission = permission.every((item) => permissions.includes(item));
  return hasPermission;
}
