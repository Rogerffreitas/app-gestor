import React, { createContext, useContext, useEffect, useState } from "react";
import { onFetchUpdateAsync } from "../services/updateService";

type ConfigContextProviderProps = {
  children?: React.ReactNode | undefined;
};

type ConfigContextType = {
  config: {
    urlApi: string;
    urlLogin: string;
    isExtraDMTPaid: boolean;
    dmtPicket: number;
    workRoutes: any[];
    lastConectionServer: string;
    keySecureStoreUser: string;
    keySecureStoreEnterprise: string;
    keySecureStoreToken: string;
  };
};

const ConfigContext = createContext({} as ConfigContextType);

export function ConfigContextProvider(props: ConfigContextProviderProps) {
  const [config, setConfig] = useState({
    urlApi: "",
    urlLogin: "",
    isExtraDMTPaid: false,
    dmtPicket: 0,
    workRoutes: [],
    lastConectionServer: "",
    keySecureStoreUser: "",
    keySecureStoreEnterprise: "",
    keySecureStoreToken: "",
  });

  useEffect(() => {
    _getconfigFromStore();
    onFetchUpdateAsync();
  }, []);

  async function _getconfigFromStore() {
    setConfig((state) => ({ ...state, isExtraDMTPaid: true }));
    setConfig((state) => ({
      ...state,
      urlLogin: process.env.EXPO_PUBLIC_URL_API,
    }));
    setConfig((state) => ({
      ...state,
      urlLogin: process.env.EXPO_PUBLIC_URL_LOGIN,
    }));
    setConfig((state) => ({ ...state, dmtPicket: 20 }));
    setConfig((state) => ({ ...state, workRoutes: ["DIÁRIA", "MEIA DIÁRIA"] }));
    setConfig((state) => ({
      ...state,
      keySecureStoreUser: process.env.EXPO_PUBLIC_KEY_SECURE_STORE_USER,
    }));
    setConfig((state) => ({
      ...state,
      keySecureStoreEnterprise:
        process.env.EXPO_PUBLIC_KEY_SECURE_STORE_ENTERPRISE,
    }));
    setConfig((state) => ({
      ...state,
      keySecureStoreToken: process.env.EXPO_PUBLIC_KEY_SECURE_STORE_TOKEN,
    }));
  }

  return (
    <ConfigContext.Provider
      value={{
        config,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  return context;
}
