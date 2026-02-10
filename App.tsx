import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import Routes from "./src/Routes";
import { ThemeProvider } from "styled-components";
import theme from "./src/global/styles/theme";
import { ConfigContextProvider } from "./src/contexts/ConfigContext";
import { AxiosHttpClientAdapter } from "./src/infra/adapter/AxiosHttpClientAdapter";
import { AuthServicesImpl } from "./src/domin/services/impl/AuthServicesImpl";
import { ApplicationContextProvider } from "./src/contexts/ApplicationContext";

export default function App() {
  const authServices = new AuthServicesImpl(new AxiosHttpClientAdapter());

  return (
    <NavigationContainer>
      <ConfigContextProvider>
        <AuthContextProvider authServices={authServices}>
          <ApplicationContextProvider>
            <ThemeProvider theme={theme}>
              <Routes />
            </ThemeProvider>
          </ApplicationContextProvider>
        </AuthContextProvider>
      </ConfigContextProvider>
    </NavigationContainer>
  );
}
