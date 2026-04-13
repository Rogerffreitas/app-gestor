import { useCallback, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useConfig } from '../../contexts/ConfigContext'
import { SyncServices } from '../../domin/services/interfaces/SyncService'
import { HttpClientGateway } from '../../domin/application/gateways/HttpClientGateway'
import { HttpRequest } from '../../domin/entity/http/dtos/HttpRequest'
import { SyncRepositoryGateway } from '../../domin/application/gateways/SyncRepositoryGateway'
import { useInjection } from '../../infra/hooks/useInjection'

type SyncButtonProps = {
    item: any
    model: string
}

export function useSyncButton({ item, model }: SyncButtonProps) {
    const syncServices = useInjection<SyncServices>('SyncServices')
    const repository = useInjection<SyncRepositoryGateway>('SyncRepositoryGateway')
    const httpClient = useInjection<HttpClientGateway>('HttpClientGateway')

    const { token, signOut } = useAuth()
    const { config } = useConfig()
    const [syncState, setSyncState] = useState<'synchronizing' | 'check' | 'sync' | null>(null)
    const animation = useRef(null)

    const handleClickSyncButton = useCallback(async () => {
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
