import { ChangeErrorFields } from '../types'
import HourMeterMonitoringDto from '../entity/hour-meter-monitoring/HourMeterMonitoringDto'

export interface HourMeterMonitoringUseCase {
    /**
     * Cria e valida um Apontamento de horimentro
     *
     * @param {HourMeterMonitoringDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {HourMeterMonitoringDto} Resultado.
     */
    createHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto>

    /**
     * Atualiza e valida um Apontamento de horimentro
     *
     * @param {HourMeterMonitoringDto} dto - DTO.
     * @param {ChangeErrorFields} changeErrorFields - Função para atulização de erros.
     * @returns {HourMeterMonitoringDto} Resultado.
     */
    updateHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto>

    /**
     * Exclui um Apontamento de horimentro
     *
     * @param {string} id - ID a ser deletado.
     * @param {string} userId - ID do Usuário que executou a exclusão.
     * @returns {void} Resultado.
     */
    deleteHourMeterMonitoringInLocalDatabase(id: string, userId: string): Promise<void>

    /**
     * Busca um Apontamento de horimentro
     *
     * @param {id} string - ID buscado.
     * @returns {HourMeterMonitoringDto | null} Retorna um DTO ou NULL.
     */
    findHourMeterMonitoringByIdInLocalDatabase(id: string): Promise<HourMeterMonitoringDto | null>

    /**
     * Carrega os Apontamentos de horimentro
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} workEquipmentId - ID do equipamento.
     * @returns {HourMeterMonitoringDto[]} DTOs.
     */
    loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringDto[]>

    /**
     * Carrega o último Apontamento de horimentro
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} workEquipmentId - ID do equipamento.
     * @returns {HourMeterMonitoringDto} DTO.
     */
    findLastHourMeterReading(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringDto>

    /**
     * Carrega os Apontamentos de horimentro
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {string} date - Data de Criação do registro.
     * @returns {HourMeterMonitoringDto[]} DTOs.
     */
    loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        date: string
    ): Promise<HourMeterMonitoringDto[]>
}
