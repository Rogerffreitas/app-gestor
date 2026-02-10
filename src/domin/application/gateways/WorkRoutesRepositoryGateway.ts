import WorkRoutesEntity from '../../entity/work-routes/WorkRoutesEntity'

export interface WorkRoutesRepositoryGateway {
    createWorkRoutesInLocalDatabase(entity: WorkRoutesEntity): Promise<WorkRoutesEntity>
    updateWorkRoutesInLocalDatabase(entity: WorkRoutesEntity): Promise<WorkRoutesEntity>
    deleteWorkRoutesInLocalDatabase(id: string, userId: string): Promise<void>
    findWorkRoutesByIdInLocalDatabase(id: string): Promise<WorkRoutesEntity | null>
    loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesEntity[]>
    loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesEntity[]>
    saveWorkRoutesServerId(entitys: WorkRoutesEntity[]): void
}
