import { useCallback, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useConfig } from '../../contexts/ConfigContext'
import { HttpRequest } from '@gestor/domain/entity/http/dtos/HttpRequest'
import { useInjection } from '@/src/contexts/InjectionContext'

type SyncButtonProps = {
    item: any
    model: string
}

export function useSyncButton({ item, model }: SyncButtonProps) {
    const syncServices = useInjection('SyncServices')
    const repository = useInjection('SyncRepositoryGateway')
    const httpClient = useInjection('HttpClientGateway')

    const { token, signOut } = useAuth()
    const { config } = useConfig()
    const [syncState, setSyncState] = useState<'synchronizing' | 'check' | 'sync' | null>(null)
    const animation = useRef(null)

    const handleClickSyncButton = useCallback(async () => {
        console.log(syncServices)
        if (syncState === 'synchronizing' || syncServices.getIsSyncing()) return

        setSyncState('synchronizing')

        try {
            const response = await httpClient.httpRequestPost({
                baseURL: config.urlApi,
                url: '/syncs/manually',
                body: item,
                token: token,
                params: { model_name: model },
            } as HttpRequest)

            await repository.saveServerId(response, model)
            await syncServices.sync(token, config.urlApi, signOut)

            setSyncState('check')
        } catch (error) {
            console.error(`[Sync Manual Error]: ${error.message}`)
            setSyncState('sync')
        }
    }, [item.id, model, token, config.urlApi, syncState])

    return {
        animation,
        syncState,
        handleClickSyncButton,
    }
}
