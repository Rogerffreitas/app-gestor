import { SyncPullResponse, SyncPushRequest, SyncPushResponse } from '../../interfaces/Sync'

export default interface SyncRepositoryGateway {
    pull(
        lastPulledAt: number,
        enterpriseId: string,
        userId: string,
        username: string,
        userRole: string,
        isFirstSync: boolean
    ): Promise<SyncPullResponse>

    push(syncData: SyncPushRequest): Promise<SyncPushResponse>

    manuallySyncing(entity: any, modelName: string): Promise<any>
}
