import { BankInformation } from '../../entity/bank-information/BankInformation'
import { EquipmentEntity } from '../../entity/equipment/EquipmentEntity'

export interface EquipmentRepositoryGateway {
    /**
     * Cria no banco de dados um entity
     *
     * @param {EquipmentEntity} entity - entity.
     * @returns {EquipmentEntity} Resultado.
     */
    createEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity>

    /**
     * Atualiza no banco de dados um entity
     *
     * @param {EquipmentEntity} entity - entity.
     * @returns {EquipmentEntity} Resultado.
     */
    updateEquipmentInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity>
    /**
     * Atualiza o Horímetro ou Hodômetro
     *
     * @param {string} equipmentId - ID.
     * @param {string} hourMeterOrOdometer - Novo Valor.
     * @returns {EquipmentEntity} Resultado.
     */
    updateHourMeterOrOdometerInLocalDatabase(entity: EquipmentEntity): Promise<EquipmentEntity>
    deleteEquipmentInLocalDatabase(id: string, userId: string): Promise<void>
    findEquipmentByIdInLocalDatabase(id: string): Promise<EquipmentEntity | null>
    loadAllEquipmentByEnterpriseIdFromLocalDatabase(enterpriseId: string): Promise<EquipmentEntity[]>
    loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string
    ): Promise<EquipmentEntity[]>
    updateEquipmentBankInformation(id: string, bankInformation: BankInformation): Promise<EquipmentEntity>
}
