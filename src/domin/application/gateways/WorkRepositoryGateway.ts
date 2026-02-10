import WorkEntity from '../../entity/work/WorkEntity'

export interface WorkRepositoryGateway {
    createWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity>
    updateWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity>
    deleteWorkInLocalDatabase(id: string, userId: string): Promise<void>
    findWorkByIdInLocalDatabase(id: string): Promise<WorkEntity | null>
    loadAllWorksByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<WorkEntity[]>
    loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
        enterpriseId: string,
        userId: string
    ): Promise<WorkEntity[]>
    saveWorkServerId(entitys: WorkEntity[]): void
}
