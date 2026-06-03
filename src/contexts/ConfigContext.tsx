import React, { createContext, useContext, useEffect, useState } from 'react'
import { onFetchUpdateAsync } from '../services/updateService'

type ConfigContextProviderProps = {
    children?: React.ReactNode | undefined
}

type ConfigContextType = {
    config: {
        isExtraDMTPaid: boolean
        dmtPicket: number
        workRoutes: any[]
        lastConectionServer: number
        urlApi: string
    }
}

const ConfigContext = createContext({} as ConfigContextType)

export function ConfigContextProvider(props: ConfigContextProviderProps) {
    const [config, setConfig] = useState({
        isExtraDMTPaid: false,
        dmtPicket: 0,
        workRoutes: [],
        lastConectionServer: 0,
        urlApi: '',
    })

    useEffect(() => {
        async function initializeApp() {
            try {
                await onFetchUpdateAsync()
                await getconfigFromStore()
            } catch (error) {
                console.error('Erro na inicialização:', error)
            }
        }
        initializeApp()
    }, [])

    async function getconfigFromStore() {
        setConfig((state) => ({
            ...state,
            isExtraDMTPaid: true,
            dmtPicket: 20,
            workRoutes: ['DIÁRIA', 'MEIA DIÁRIA'],
            urlApi: process.env.EXPO_PUBLIC_URL_API ?? '',
        }))
    }

    return (
        <ConfigContext.Provider
            value={{
                config,
            }}
        >
            {props.children}
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    const context = useContext(ConfigContext)
    return context
}
