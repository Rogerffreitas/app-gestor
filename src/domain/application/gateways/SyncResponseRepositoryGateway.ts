import { SyncPushResponse } from '../../interfaces/Sync'

export interface SyncResponseRepositoryGateway {
    saveAllServerIds(syncData: SyncPushResponse): Promise<void>
    saveServerId(data: any, modelName): Promise<void>
}
