import { createContext, useContext, useState } from "react";
import WorkDto from "../domin/entity/work/WorkDto";

type ApplicationContextProviderProps = {
  children?: React.ReactNode | undefined;
};

type ApplicationContextType = {
  work: WorkDto | null;
  saveWork: (work: WorkDto) => void;
};

const ApplicationContext = createContext({} as ApplicationContextType);

export function ApplicationContextProvider(
  props: ApplicationContextProviderProps
) {
  const [work, setWork] = useState<WorkDto>(null);
  function saveWork(work: WorkDto) {
    setWork(work);
  }
  return (
    <ApplicationContext.Provider
      value={{
        work,
        saveWork,
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);
  return context;
}
