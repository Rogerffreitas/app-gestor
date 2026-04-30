import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContextProvider } from './src/contexts/AuthContext'
import Routes from './src/Routes'
import { ThemeProvider } from 'styled-components'
import theme from './src/global/styles/theme'
import { ConfigContextProvider } from './src/contexts/ConfigContext'
import { ApplicationContextProvider } from './src/contexts/ApplicationContext'
import { NetworkProvider } from './src/contexts/NetworkContext'
import { InjectionProvider } from './src/contexts/InjectionContext'

export default function App() {
    return (
        <NavigationContainer>
            <InjectionProvider>
                <NetworkProvider>
                    <ConfigContextProvider>
                        <AuthContextProvider>
                            <ApplicationContextProvider>
                                <ThemeProvider theme={theme}>
                                    <Routes />
                                </ThemeProvider>
                            </ApplicationContextProvider>
                        </AuthContextProvider>
                    </ConfigContextProvider>
                </NetworkProvider>
            </InjectionProvider>
        </NavigationContainer>
    )
}
