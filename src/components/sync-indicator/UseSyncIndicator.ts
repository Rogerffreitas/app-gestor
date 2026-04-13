import { useEffect, useRef } from 'react'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { useNetwork } from '../../contexts/NetworkContext'
import { useSync } from '../../infra/hooks/UseSync'

export function useSyncIndicator() {
    const animation = useRef(null)
    const { isConnected, connectionType } = useNetwork()
    const { status, syncState, performSync } = useSync()

    useEffect(() => {
        if (isConnected && connectionType === NetInfoStateType.wifi) {
            performSync()
        }
    }, [isConnected, connectionType])

    return {
        isSyncing: syncState,
        status,
        animation,
        isConnected,
        connectionType,
        manualSync: performSync,
    }
}
