import { ChangeErrorFields } from '../../../types'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import EquipmentDto from '../../entity/equipment/EquipmentDto'

export interface EquipmentServices {
    createEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto>
    updateEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto>
    updateEquipmentBankInformation(id: string, bankInformation: BankInformation): Promise<EquipmentDto>
    deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentDto | null>
    saveEquipmentServerId(dtos: EquipmentDto[]): void
    loadAllEquipmentByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<EquipmentDto[]>
    loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentDto[]>
    loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentDto[]>
}
