import MaterialEntity from '../../entity/material/MaterialEntity'

export interface MaterialRepositoryGateway {
    createMaterialInLocalDatabase(entity: MaterialEntity): Promise<MaterialEntity>
    updateMaterialInLocalDatabase(entity: MaterialEntity): Promise<MaterialEntity>
    deleteMaterialInLocalDatabase(id: string, userId: string): Promise<void>
    findMaterialByIdInLocalDatabase(id: string): Promise<MaterialEntity | null>
    loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialEntity[]>
    loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        depositId: string
    ): Promise<MaterialEntity[]>
    saveMaterialServerId(entitys: MaterialEntity[]): void
}
