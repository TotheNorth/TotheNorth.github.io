import React, { createContext, ComponentType } from "react";

const StateContext = createContext<any>(null);
const StateDispatchContext = createContext<any>(null);
export function useGlobalState() {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error("必须在 globalProvider 内使用 useGlobalState");
  }
  return context;
}
export function useGlobalDispatch() {
  const context = React.useContext(StateDispatchContext);
  if (context === undefined) {
    throw new Error("必须在 globalProvider 内使用 useGlobalDispatch");
  }
  return context;
}
export const GlobalProvider: React.FC<{
  data: any;
  children: React.ReactNode;
}> = ({ children, data }) => {
  const [state, dispatch] = React.useState(data);
  return (
    <StateContext.Provider value={state}>
      <StateDispatchContext.Provider value={dispatch}>
        {children}
      </StateDispatchContext.Provider>
    </StateContext.Provider>
  );
};
export const WidgetsContext = createContext<
  Record<string, ComponentType> | undefined
>(undefined);

export const ConfigContext = createContext<any>(undefined);

export const AgulWrapperConfigContext = createContext<any>(undefined);
