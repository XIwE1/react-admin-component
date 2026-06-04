import React from "react";
import usePermission from "../../hooks/usePermission";
import { Result } from "antd";

interface WithPermissionProps {
  permission?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function WithPermission(props: WithPermissionProps) {
  const { permission, fallback, children } = props;

  const hasPermission = usePermission({ permission });

  if (hasPermission) return children;

  return (
    fallback || (
      <Result
        status={403}
        title="403"
        subTitle="You are not authorized to access this page"
      />
    )
  );
}
