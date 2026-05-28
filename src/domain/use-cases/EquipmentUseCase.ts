import { ChangeErrorFields } from '../types'
import { BankInformation } from '../entity/bank-information/BankInformation'
import EquipmentDto from '../entity/equipment/EquipmentDto'

export interface EquipmentUseCase {
    createEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto>
    updateEquipmentInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto>
    /**
     * Atualiza o Horímetro ou Hodômetro
     *
     * @param {string} equipmentId - ID.
     * @param {string} hourMeterOrOdometer - Novo Valor.
     * @returns {EquipmentEntity} Resultado.
     */
    updateHourMeterOrOdometerInLocalDatabase(
        dto: EquipmentDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<EquipmentDto>
    updateEquipmentBankInformation(id: string, bankInformation: BankInformation): Promise<EquipmentDto>
    deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentDto | null>
    loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentDto[]>
    loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentDto[]>
}
