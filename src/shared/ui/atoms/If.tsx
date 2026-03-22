import React from 'react';

export type IfProps = {
  children?: React.ReactNode;
  condition?: unknown;
};

export default function If({ children, condition }: IfProps): React.ReactElement | null {
  if (!condition) {
    return null;
  }
  return <>{children}</>;
}
