import { useEffect, useState } from 'react'
import { SyncServices } from '../../domin/services/interfaces/SyncService'
import { useInjection } from './useInjection'
import { useAuth } from '../../contexts/AuthContext'
import { useConfig } from '../../contexts/ConfigContext'
import { Alert, ToastAndroid } from 'react-native'
import { useNetwork } from '@/src/contexts/NetworkContext'

export function useSync() {
    const syncServices = useInjection<SyncServices>('SyncServices')
    const [syncState, setSyncState] = useState<boolean>(false)
    const [status, setStatus] = useState(syncServices.getStatus())
    const Auth = useAuth()
    const { config } = useConfig()
    const { isConnected } = useNetwork()

    useEffect(() => {
        const unsubscribe = syncServices.subscribe((newStatus, isSyncing) => {
            setSyncState(isSyncing)
            setStatus(newStatus)
        })
        return () => unsubscribe()
    }, [syncServices])

    async function performSync() {
        if (syncServices.getIsSyncing() || !Auth.token || !isConnected) return

        ToastAndroid.show('Sincronizando dados...', ToastAndroid.SHORT)

        try {
            await syncServices.sync(Auth.token, config.urlApi, Auth.signOut)
            config.lastConectionServer = Date.now()
        } catch (error) {
            Alert.alert(`[Sync Error]: ${error}`)
            console.info(`[Sync Error]: ${error}`)
        }
    }

    return {
        syncState,
        status,
        performSync,
    }
}
