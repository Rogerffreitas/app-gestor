import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'

export interface FuelSupplyRepositoryGateway {
    /**
     * Cria no banco de dados um entity
     *
     * @param {FuelSupplyEntity} entity - entity.
     * @returns {FuelSupplyEntity} Resultado.
     */
    createFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity>

    /**
     * Atualiza no banco de dados um entity
     *
     * @param {FuelSupplyEntity} entity - entity.
     * @returns {FuelSupplyEntity} Resultado.
     */
    updateFuelSupplyInLocalDatabase(entity: FuelSupplyEntity): Promise<FuelSupplyEntity>

    /**
     * método para um abastecimento
     *
     * @param {id} string - ID do abastecimento a ser deletado.
     * @param {userId} string - ID do Usuário que executou a exclusão.
     * @returns {void} Resultado.
     */
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void>
    saveFuelSupplyServerId(entiteis: FuelSupplyEntity[]): void

    loadById(id: string): Promise<FuelSupplyEntity>

    loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity>

    /**
     * Carrega o saldo de abastecimentos do tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - Id caminhão de manutenção.
     * @returns {number} saldo de abastecimentos.
     */
    loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<number>

    /**
     * Carrega os abastecimentos do Veiculo de transporte
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} transportVehicleOrWorkEquipmentId - Id do caminhão de transporte ou equipamento.
     * @param {string} type - Tipo de abastecimento.
     * @returns {FuelSupplyEntity[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]>

    /**
     * Carrega os abastecimentos feitos pelo caminhão tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - Id caminhão de manutenção.
     * @param {string} type - Tipo de abastecimento.
     * @returns {FuelSupplyEntity[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyEntity[]>

    /**
     * Carrega os abastecimentos feitos pelo caminhão tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - Id caminhão de manutenção.
     * @returns {FuelSupplyEntity[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyEntity[]>
}
