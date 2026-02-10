import React, { createContext, useContext, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import User from "../interfaces/User";
import * as SecureStore from "expo-secure-store";
import Token from "../interfaces/Token";
import Enterprise from "../interfaces/Enterprise";
import { useConfig } from "./ConfigContext";
import AuthServices from "../domin/services/interfaces/AuthServices";
import { HttpRequest } from "../domin/entity/http/dtos/HttpRequest";

type AuthContextProviderProps = {
  children?: React.ReactNode | undefined;
  authServices: AuthServices;
};

type AuthContextType = {
  token: Token;
  firstAccess: boolean;
  signed: boolean;
  user: User | undefined;
  enterprise: Enterprise;
  loading: boolean;
  setFirstAccess: (acesso: boolean) => void;
  signIn: (username: string, senha: string) => void;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [firstAccess, setFirstAccess] = useState(true);
  const [user, setUser] = useState<User>();
  const [enterprise, setEnterprise] = useState<Enterprise>();
  const [token, setToken] = useState<Token>();
  const [loading, setLoading] = useState(true);
  const { config } = useConfig();

  async function signIn(username: string, password: string) {
    try {
      const { user, enterprise, token } =
        await props.authServices.loginByUsernameAndPassword({
          baseURL: config.urlApi,
          url: config.urlLogin,
          body: { username, password },
        } as HttpRequest);
      setEnterprise(enterprise);
      setUser(user);
      setToken(token);
      await SecureStore.setItemAsync(
        config.keySecureStoreUser,
        JSON.stringify(user)
      );
      await SecureStore.setItemAsync(
        config.keySecureStoreToken,
        JSON.stringify(token)
      );
      await SecureStore.setItemAsync(
        config.keySecureStoreEnterprise,
        JSON.stringify(enterprise)
      );
    } catch (err) {
      console.error(err);
    }
  }
  function signOut() {
    SecureStore.deleteItemAsync(config.keySecureStoreUser).then(() => {
      setUser(null);
    });
    SecureStore.deleteItemAsync(config.keySecureStoreToken).then(() => {
      setToken(null);
    });

    SecureStore.deleteItemAsync(config.keySecureStoreEnterprise).then(() => {
      setEnterprise(null);
    });
  }

  async function getUserFromStore() {
    if (Number(Platform.Version) >= 33) {
      setFirstAccess(false);
    } else {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      setFirstAccess(!granted);
    }
    setLoading(false);
    let resultUser = await SecureStore.getItemAsync(config.keySecureStoreUser);
    let resultToken = await SecureStore.getItemAsync(
      config.keySecureStoreToken
    );
    let resultEnterprise = await SecureStore.getItemAsync(
      config.keySecureStoreEnterprise
    );
    setUser(await JSON.parse(resultUser));
    setToken(await JSON.parse(resultToken));
    setEnterprise(await JSON.parse(resultEnterprise));
  }

  useEffect(() => {
    getUserFromStore();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        firstAccess,
        setFirstAccess,
        signed: !!user,
        user,
        enterprise,
        loading,
        signIn,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
