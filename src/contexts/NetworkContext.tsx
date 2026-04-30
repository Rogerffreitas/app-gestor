import React, { createContext, useState, useEffect, useContext } from 'react'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'

type NetworkContextType = {
    isConnected: boolean
    connectionType: NetInfoStateType
}

const NetworkContext = createContext({} as NetworkContextType)

export const NetworkProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true)
    const [connectionType, setConnectionType] = useState<NetInfoStateType>(NetInfoStateType.unknown)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected)
            setConnectionType(state.type)
        })

        return () => unsubscribe()
    }, [])

    return (
        <NetworkContext.Provider value={{ isConnected, connectionType }}>{children}</NetworkContext.Provider>
    )
}

export const useNetwork = () => useContext(NetworkContext)
