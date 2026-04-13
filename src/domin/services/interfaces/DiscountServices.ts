import { ChangeErrorFields } from '../../../types'
import DiscountDto from '../../entity/discount/DiscountDto'

export interface DiscountServices {
    /**
     * Cria e valida um Desconto
     *
     * @param {DiscountDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {DiscountDto} Resultado.
     */
    createDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto>

    /**
     * Atualiza e valida um Deconto
     *
     * @param {DiscountDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {DiscountDto} Resultado.
     */
    updateDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto>

    /**
     * Exclui um desconto
     *
     * @param {id} string - ID do desconto a ser deletado.
     * @param {userId} string - ID do Usuário que executou a exclusão.
     * @returns {void} Resultado.
     */
    deleteDiscountInLocalDatabase(id: string, userId: string): Promise<void>

    /**
     * Busca um desconto
     *
     * @param {id} string - ID do desconto.
     * @returns {DiscountDto | null} Retorna um desconto ou NULL.
     */
    findDiscountByIdInLocalDatabase(id: string): Promise<DiscountDto | null>

    /**
     * Salva os ID_SERVER retornado pela API
     *
     * @param {DiscountDto} DTOS - lista IDs retornados pela API.
     * @returns {void} Resultado.
     */
    saveDiscountServerId(dtos: DiscountDto[]): void

    /**
     * Carrega os Descontos do Veiculo de transporte ou Equipamento
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} discountType - Tipo de desconto.
     * @param {string} transportVehicleOrWorkEquipmentId - Id do caminhão de transporte ou equipamento.
     * @returns {DiscountDto[]} Lista de Descontos.
     */
    loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        discountType: string,
        transportVehicleOrWorkEquipmentId: string
    ): Promise<DiscountDto[]>
}
