import { TYPES } from '../../../infra/ioc/types'
import { ChangeErrorFields } from '../../../types'
import { HourMeterMonitoringRepositoryGateway } from '../../application/gateways/HourMeterMonitoringRepositoryGateway'
import HourMeterMonitoringDto from '../../entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { HourMeterMonitoringEntity } from '../../entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { HourMeterMonitoringServices } from '../interfaces/HourMeterMonitoringServices'
import { inject, injectable } from 'inversify'

@injectable()
export class HourMeterMonitoringServicesImpl implements HourMeterMonitoringServices {
    constructor(
        @inject(TYPES.HourMeterMonitoringRepositoryGateway)
        private repository: HourMeterMonitoringRepositoryGateway
    ) {}

    async createHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto> {
        const entity = new HourMeterMonitoringEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.createHourMeterMonitoringInLocalDatabase(entity)
        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async updateHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto> {
        const entity = new HourMeterMonitoringEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.updateHourMeterMonitoringInLocalDatabase(entity)
        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async deleteHourMeterMonitoringInLocalDatabase(id: string, userId: string): Promise<void> {
        return await this.repository.deleteHourMeterMonitoringInLocalDatabase(id, userId)
    }
    findHourMeterMonitoringByIdInLocalDatabase(id: string): Promise<HourMeterMonitoringDto> {
        throw new Error('Method not implemented.')
    }
    saveHourMeterMonitoringServerId(dtos: HourMeterMonitoringDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringDto[]> {
        const result =
            await this.repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                enterpriseId,
                workId,
                workEquipmentId
            )
        return result.map((item) => {
            return new HourMeterMonitoringDto().entityToDto(item)
        })
    }
    async findLastHourMeterReading(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringDto> {
        const result = await this.repository.findLastHourMeterReading(enterpriseId, workId, workEquipmentId)

        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        date: string
    ): Promise<HourMeterMonitoringDto[]> {
        const result =
            await this.repository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                enterpriseId,
                workId,
                date
            )
        return result.map((item) => {
            return new HourMeterMonitoringDto().entityToDto(item)
        })
    }
}
