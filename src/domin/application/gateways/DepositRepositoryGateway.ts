import DepositEntity from '../../entity/deposit/DepositEntity'

export interface DepositRepositoryGateway {
    createDepositInLocalDatabase(entity: DepositEntity): Promise<DepositEntity>
    updateDepositInLocalDatabase(entity: DepositEntity): Promise<DepositEntity>
    deleteDepositInLocalDatabase(id: string, userId: string): Promise<void>
    findDepositByIdInLocalDatabase(id: string): Promise<DepositEntity | null>
    loadAllDepositByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<DepositEntity[]>
    saveDepositServerId(entitys: DepositEntity[]): void
}
