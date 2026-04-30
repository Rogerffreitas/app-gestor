import SyncRepositoryGateway from '../application/gateways/SyncRepositoryGateway'
import { SyncPullResponse, SyncPushRequest, SyncPushResponse } from '../interfaces/Sync'
import SyncUseCase from '../use-cases/SyncUseCase'

export default class SyncInteractor implements SyncUseCase {
    private repository: SyncRepositoryGateway
    constructor(repository: SyncRepositoryGateway) {
        this.repository = repository
    }

    async manuallySyncing(entity: any, modelName: string): Promise<any> {
        const { serverId, status, ...data } = entity
        console.info(data)
        return await this.repository.manuallySyncing(data, modelName)
        /*console.info(result)
        return {
            ...result,
            createdAt: result.createdAt ? Number(result.createdAt) : Date.now(),
            updatedAt: result.updatedAt ? Number(result.updatedAt) : Date.now(),
        }*/
    }
    async push(syncData: SyncPushRequest): Promise<SyncPushResponse> {
        /* const syncPushRequest = {} as SyncPushRequest

        for (const [key, dtos] of Object.entries(syncData)) {
            const createdFormatted = dtos.created.map(({ Status, Changed, serverId, ...dto }) => dto)
            const updatedFormatted = dtos.updated.map(({ Status, Changed, serverId, ...dto }) => dto)
            syncPushRequest[key as keyof SyncPushRequest] = {
                created: createdFormatted,
                updated: updatedFormatted,
                deleted: dtos.deleted || [],
            }
        }*/

        return await this.repository.push(syncData)
    }
    async pull(
        lastPulledAt: number,
        enterpriseId: string,
        userId: string,
        username: string,
        userRole: string
    ): Promise<SyncPullResponse> {
        let isFirstSync = false
        if (!lastPulledAt) {
            lastPulledAt = Date.now() - 7776000000
            isFirstSync = true
        }
        return this.repository.pull(lastPulledAt, enterpriseId, userId, username, userRole, isFirstSync)
    }
}
