import { ChangeErrorFields } from '../../../types'
import DiscountEntity from '../../entity/discount/DiscountEntity'

export interface DiscountRepositoryGateway {
    /**
     * Cria e valida um Desconto
     *
     * @param {DiscountEntity} entity - Entity.
     * @returns {DiscountEntity} Resultado.
     */
    createDiscountInLocalDatabase(entity: DiscountEntity): Promise<DiscountEntity>

    /**
     * Atualiza e valida um Deconto
     *
     * @param {DiscountEntity} entity - Entity.
     * @returns {DiscountEntity} Resultado.
     */
    updateDiscountInLocalDatabase(entity: DiscountEntity): Promise<DiscountEntity>

    /**
     * Exclui um desconto
     *
     * @param {string} id - ID do desconto a ser deletado.
     * @param {string} userId - ID do Usuário que executou a exclusão.
     * @returns {void} Resultado.
     */
    deleteDiscountInLocalDatabase(id: string, userId: string): Promise<void>

    /**
     * Busca um desconto
     *
     * @param {string} id - ID do desconto.
     * @returns {DiscountEntity | null} Retorna um desconto ou NULL.
     */
    findDiscountByIdInLocalDatabase(id: string): Promise<DiscountEntity | null>

    /**
     * Salva os ID_SERVER retornado pela API
     *
     * @param {DiscountEntity[]} entitys - lista IDs retornados pela API.
     * @returns {void} Resultado.
     */
    saveDiscountServerId(entitys: DiscountEntity[]): void

    /**
     * Carrega os Descontos do Veiculo de transporte ou Equipamento
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} discountType - Tipo de desconto.
     * @param {string} transportVehicleOrWorkEquipmentId - Id do caminhão de transporte ou equipamento.
     * @returns {DiscountEntity[]} Lista de Descontos.
     */
    loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        discountType: string,
        transportVehicleOrWorkEquipmentId: string
    ): Promise<DiscountEntity[]>
}
