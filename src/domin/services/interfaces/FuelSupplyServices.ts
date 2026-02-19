import { ChangeErrorFields } from '../../../types'
import { FuelSupplyDto } from '../../entity/fuel-supply/FuelSupplyDto'

export interface FuelSupplyServices {
    /**
     * Cria e valida um abastecimento
     *
     * @param {FuelSupplyDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {FuelSupplyDto} Resultado.
     */
    createFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto>

    /**
     * Atualiza e valida um abastecimento
     *
     * @param {FuelSupplyDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {FuelSupplyDto} Resultado.
     */
    updateFuelSupplyInLocalDatabase(
        dto: FuelSupplyDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<FuelSupplyDto>

    /**
     * Exclui um abastecimento
     *
     * @param {id} string - ID do abastecimento a ser deletado.
     * @param {userId} string - ID do Usuário que executou a exclusão.
     * @returns {void} Resultado.
     */
    deleteFuelSupplyInLocalDatabase(id: string, userId: string): Promise<void>

    /**
     * Salva os ID_SERVER retornado pela API
     *
     * @param {FuelSupplyDto} DTOS - lista IDs retornados pela API.
     * @returns {void} Resultado.
     */
    saveFuelSupplyServerId(dtos: FuelSupplyDto[]): void

    loadById(id: string): Promise<FuelSupplyDto>

    /**
     * Carrega o último de abastecimentos do tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - ID caminhão de manutenção.
     * @returns {FuelSupplyDto} Último abastecimentos.
     */
    loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyDto>

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
     * @returns {FuelSupplyDto[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        transportVehicleOrWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyDto[]>

    /**
     * Carrega os abastecimentos feitos pelo caminhão tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - Id caminhão de manutenção.
     * @param {string} type - Tipo de abastecimento.
     * @returns {FuelSupplyDto[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string,
        type: string
    ): Promise<FuelSupplyDto[]>

    /**
     * Carrega os abastecimentos feitos pelo caminhão tanque
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} maintenanceTrucksWorkEquipmentId - Id caminhão de manutenção.
     * @returns {FuelSupplyDto[]} Lista de abastecimentos.
     */
    loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        maintenanceTrucksWorkEquipmentId: string
    ): Promise<FuelSupplyDto[]>
}
