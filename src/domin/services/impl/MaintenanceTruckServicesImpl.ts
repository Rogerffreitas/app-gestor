import { ChangeErrorFields } from '../../../types'
import { MaintenanceTruckGateway } from '../../application/gateways/MaintenanceTruckRepositoryGateway'
import { MaintenanceTruckDto } from '../../entity/maintenance-truck/MaintenanceTruckDto'
import { MaintenanceTruckEntity } from '../../entity/maintenance-truck/MaintenanceTruckEntity'
import { MaintenanceTruckServices } from '../interfaces/MaintenanceTruckServices'

export class MaintenanceTruckServicesImpl implements MaintenanceTruckServices {
    private repository: MaintenanceTruckGateway

    constructor(maintenanceTruckRepositoryGateway: MaintenanceTruckGateway) {
        this.repository = maintenanceTruckRepositoryGateway
    }

    async createMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaintenanceTruckDto> {
        const entity = new MaintenanceTruckEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityCreated = await this.repository.createMaintenanceTruckInLocalDatabase(entity)
        return new MaintenanceTruckDto().entityToDto(entityCreated)
    }
    async updateMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaintenanceTruckDto> {
        const entity = new MaintenanceTruckEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityUpdated = await this.repository.createMaintenanceTruckInLocalDatabase(entity)
        return new MaintenanceTruckDto().entityToDto(entityUpdated)
    }
    deleteMaintenanceTruckInLocalDatabase(
        id: string,
        workEquipmentId: string,
        userId: string
    ): Promise<void> {
        return this.repository.deleteMaintenanceTruckInLocalDatabase(id, workEquipmentId, userId)
    }
    async findMaintenanceTruckByIdInLocalDatabase(id: string): Promise<MaintenanceTruckDto> {
        const entity = await this.repository.findMaintenanceTruckByIdInLocalDatabase(id)
        return new MaintenanceTruckDto().entityToDto(entity)
    }
    saveMaintenanceTruckServerId(dtos: MaintenanceTruckDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckDto[]> {
        const entities =
            await this.repository.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId
            )
        return entities.map((entity) => new MaintenanceTruckDto().entityToDto(entity))
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<MaintenanceTruckDto[]> {
        const entities =
            await this.repository.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                workId
            )
        return entities.map((entity) => new MaintenanceTruckDto().entityToDto(entity))
    }
}
