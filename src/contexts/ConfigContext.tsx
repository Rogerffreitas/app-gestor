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
        _getconfigFromStore()
        onFetchUpdateAsync()
    }, [])

    async function _getconfigFromStore() {
        console.log('_getconfigFromStore')
        setConfig((state) => ({ ...state, isExtraDMTPaid: true }))
        setConfig((state) => ({ ...state, dmtPicket: 20 }))
        setConfig((state) => ({ ...state, workRoutes: ['DIÁRIA', 'MEIA DIÁRIA'] }))
        setConfig((state) => ({ ...state, urlApi: process.env.EXPO_PUBLIC_URL_API }))
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
