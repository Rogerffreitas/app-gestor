import { HourMeterMonitoringEntity } from '../../entity/hour-meter-monitoring/HourMeterMonitoringEntity';

export interface HourMeterMonitoringRepositoryGateway {
  /**
   * Cria e valida um Apontamento de horimentro
   *
   * @param {HourMeterMonitoringEntity} entity - entity.
   * @returns {HourMeterMonitoringEntity} Resultado.
   */
  createHourMeterMonitoringInLocalDatabase(
    entity: HourMeterMonitoringEntity,
  ): Promise<HourMeterMonitoringEntity>;

  /**
   * Atualiza e valida um Apontamento de horimentro
   *
   * @param {HourMeterMonitoringEntity} entity - entity.
   * @returns {HourMeterMonitoringEntity} Resultado.
   */
  updateHourMeterMonitoringInLocalDatabase(
    entity: HourMeterMonitoringEntity,
  ): Promise<HourMeterMonitoringEntity>;

  /**
   * Exclui um Apontamento de horimentro
   *
   * @param {string} id - ID a ser deletado.
   * @param {string} userId - ID do Usuário que executou a exclusão.
   * @returns {void} Resultado.
   */
  deleteHourMeterMonitoringInLocalDatabase(
    id: string,
    userId: string,
  ): Promise<void>;

  /**
   * Busca um Apontamento de horimentro
   *
   * @param {string} id - ID buscado.
   * @returns {HourMeterMonitoringEntity | null} Retorna um entity ou NULL.
   */
  findHourMeterMonitoringByIdInLocalDatabase(
    id: string,
  ): Promise<HourMeterMonitoringEntity | null>;

  /**
   * Salva os ID_SERVER retornado pela API
   *
   * @param {HourMeterMonitoringEntity} entities - lista IDs retornados pela API.
   * @returns {void} Resultado.
   */
  saveHourMeterMonitoringServerId(entities: HourMeterMonitoringEntity[]): void;

  /**
   * Carrega os Apontamentos de horimentro
   *
   * @param {string} enterpriseId - Empresa.
   * @param {string} workId - Obra.
   * @param {string} workEquipmentId - ID do equipamento.
   * @returns {HourMeterMonitoringEntity[]} DTOs.
   */
  loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
    enterpriseId: string,
    workId: string,
    workEquipmentId: string,
  ): Promise<HourMeterMonitoringEntity[]>;

  /**
   * Carrega o último Apontamento de horimentro
   *
   * @param {string} enterpriseId - Empresa.
   * @param {string} workId - Obra.
   * @param {string} workEquipmentId - ID do equipamento.
   * @returns {HourMeterMonitoringEntity} entity.
   */
  findLastHourMeterReading(
    enterpriseId: string,
    workId: string,
    workEquipmentId: string,
  ): Promise<HourMeterMonitoringEntity>;

  /**
   * Carrega os Apontamentos de horimentro
   *
   * @param {string} enterpriseId - Empresa.
   * @param {string} workId - Obra.
   * @param {string} date - Data de Criação do registro.
   * @returns {HourMeterMonitoringEntity[]} entities.
   */
  loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
    enterpriseId: string,
    workId: string,
    date: string,
  ): Promise<HourMeterMonitoringEntity[]>;
}
