import { ChangeErrorFields } from '../types'
import { HourMeterMonitoringRepositoryGateway } from '../application/gateways/HourMeterMonitoringRepositoryGateway'
import HourMeterMonitoringDto from '../entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { HourMeterMonitoringEntity } from '../entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { HourMeterMonitoringUseCase } from '../use-cases/HourMeterMonitoringUseCase'

export class HourMeterMonitoringInteractor implements HourMeterMonitoringUseCase {
    hourMeterMonitoringRepositoryGateway: HourMeterMonitoringRepositoryGateway
    constructor(hourMeterMonitoringRepositoryGateway: HourMeterMonitoringRepositoryGateway) {
        this.hourMeterMonitoringRepositoryGateway = hourMeterMonitoringRepositoryGateway
    }

    async createHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto> {
        const entity = new HourMeterMonitoringEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result =
            await this.hourMeterMonitoringRepositoryGateway.createHourMeterMonitoringInLocalDatabase(entity)
        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async updateHourMeterMonitoringInLocalDatabase(
        dto: HourMeterMonitoringDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<HourMeterMonitoringDto> {
        const entity = new HourMeterMonitoringEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result =
            await this.hourMeterMonitoringRepositoryGateway.updateHourMeterMonitoringInLocalDatabase(entity)
        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async deleteHourMeterMonitoringInLocalDatabase(id: string, userId: string): Promise<void> {
        return await this.hourMeterMonitoringRepositoryGateway.deleteHourMeterMonitoringInLocalDatabase(
            id,
            userId
        )
    }
    async findHourMeterMonitoringByIdInLocalDatabase(id: string): Promise<HourMeterMonitoringDto> {
        return new HourMeterMonitoringDto().entityToDto(
            await this.hourMeterMonitoringRepositoryGateway.findHourMeterMonitoringByIdInLocalDatabase(id)
        )
    }

    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        workEquipmentId: string
    ): Promise<HourMeterMonitoringDto[]> {
        const result =
            await this.hourMeterMonitoringRepositoryGateway.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
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
        const result = await this.hourMeterMonitoringRepositoryGateway.findLastHourMeterReading(
            enterpriseId,
            workId,
            workEquipmentId
        )

        return new HourMeterMonitoringDto().entityToDto(result)
    }
    async loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        date: string
    ): Promise<HourMeterMonitoringDto[]> {
        const result =
            await this.hourMeterMonitoringRepositoryGateway.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                enterpriseId,
                workId,
                date
            )
        return result.map((item) => {
            return new HourMeterMonitoringDto().entityToDto(item)
        })
    }
}
