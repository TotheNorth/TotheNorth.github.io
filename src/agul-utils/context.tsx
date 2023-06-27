import React, { createContext, ComponentType } from "react";
import _ from "lodash";
import { LoadingContainerId } from "@/agul-utils/constant";

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

export const AgulWrapperConfigContext = createContext<any>(undefined);
export const ConfigProvider: React.FC<{
  children?: React.ReactNode;
  requestHeaders?: Record<string, string | number>;
  needReqSign?: boolean;
  loadingContainerId?: string;
}> = ({ children, requestHeaders, needReqSign, loadingContainerId }) => {
  if (loadingContainerId) {
    _.set(window, LoadingContainerId, loadingContainerId);
  }
  return (
    <AgulWrapperConfigContext.Provider value={{ requestHeaders, needReqSign }}>
      {children}
    </AgulWrapperConfigContext.Provider>
  );
};
