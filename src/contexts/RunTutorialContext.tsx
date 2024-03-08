import { ReactNode, createContext, useContext, useState } from 'react';

// Define the context type
interface RunTutorialContextType {
  runTutorial: boolean;
  setRunTutorial: (run: boolean) => void;
}

// Create the context with an initial default value
const RunTutorialContext = createContext<RunTutorialContextType>({
  runTutorial: false,
  // Provide an initial noop function for setRunTutorial
  setRunTutorial: () => { console.warn("setRunTutorial was called without a RunTutorialProvider") },
});

// Define the provider component type
interface RunTutorialProviderProps {
  children: ReactNode;
}

export const RunTutorialProvider: React.FC<RunTutorialProviderProps> = ({ children }) => {
  const [runTutorial, setRunTutorial] = useState<boolean>(false);

  return (
    <RunTutorialContext.Provider value={{ runTutorial, setRunTutorial }}>
      {children}
    </RunTutorialContext.Provider>
  );
};

// Custom hook to use the context
export const useRunTutorial = () => useContext(RunTutorialContext);
