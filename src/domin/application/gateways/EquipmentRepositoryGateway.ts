import { BankInformation } from '../../entity/bank-information/BankInformation'
import { EquipmentEntity } from '../../entity/equipment/EquipmentEntity'

export interface EquipmentRepositoryGateway {
    createEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity>
    updateEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity>
    deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentEntity | null>
    loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentEntity[]>
    saveEquipmentServerId(entitys: EquipmentEntity[]): void
    loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentEntity[]>
    updateEquipmentBankInformation(id: string, bankInformation: BankInformation): Promise<EquipmentEntity>
    loadAllEquipmentByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<EquipmentEntity[]>
}
