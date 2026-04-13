import { SyncPushResponse } from '../../../interfaces/SyncPushResponse'

export interface SyncRepositoryGateway {
    saveAllServerIds(syncData: SyncPushResponse): Promise<void>
    saveServerId(data: any, modelName): Promise<void>
}
