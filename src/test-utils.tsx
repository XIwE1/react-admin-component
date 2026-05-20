import React, { ReactNode } from 'react';

// Mock store context type
interface MockStoreContextType {
  value: any;
}

// Simple mock store provider
export const MockStoreProvider: React.FC<MockStoreContextType> = ({ value, children }) => {
  return <div data-testid="mock-store-provider">{children}</div>;
};