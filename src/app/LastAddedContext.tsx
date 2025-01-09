import React, { createContext, useState, useContext, ReactNode } from 'react';
const LastAddedContext = createContext<{
  lastAdded: string;
  setLastAdded: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export function LastAddedProvider({ children }: { children: ReactNode }) {
  const [lastAdded, setLastAdded] = useState('');

  return (
    <LastAddedContext.Provider value={{ lastAdded, setLastAdded }}>
      {children}
    </LastAddedContext.Provider>
  );
}
// Custom hook to use the LastAddedContext
export function useLastAdded() {
  const context = useContext(LastAddedContext);
  if (!context) {
    throw new Error('useLastAdded must be used within a LastAddedProvider');
  }
  return context;
}
