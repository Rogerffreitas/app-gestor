import { SyncPullResponse, SyncPushRequest, SyncPushResponse } from '../interfaces/Sync'

export default interface SyncUseCase {
    pull(
        lastPulledAt: number,
        enterpriseId: string,
        userId: string,
        username: string,
        userRole: string,
    ): Promise<SyncPullResponse>

    push(sycnData: SyncPushRequest): Promise<SyncPushResponse>
    manuallySyncing(entity: any, modelName: string): Promise<any>
}
