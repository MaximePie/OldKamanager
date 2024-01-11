import { createContext, useContext, useState } from "react";

const DebugContext = createContext({
  debugMessages: [],
  addDebugMessage: (message: any) => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const DebugContextProvider = ({ children }: ProviderProps) => {
  const [debugMessages, setDebugMessages] = useState<any>([]);
  const addDebugMessage = (message: any) => {
    setDebugMessages([...debugMessages, message]);
  };
  return (
    <DebugContext.Provider value={{ debugMessages, addDebugMessage }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugContext = () => {
  const { debugMessages, addDebugMessage } = useContext(DebugContext);
  return { debugMessages, addDebugMessage };
};
