import { ChangeErrorFields } from '../types'
import { MaintenanceTruckRepositoryGateway } from '../application/gateways/MaintenanceTruckRepositoryGateway'
import { MaintenanceTruckDto } from '../entity/maintenance-truck/MaintenanceTruckDto'
import { MaintenanceTruckEntity } from '../entity/maintenance-truck/MaintenanceTruckEntity'
import { MaintenanceTruckUseCase } from '../use-cases/MaintenanceTruckUseCase'

export class MaintenanceTruckInteractor implements MaintenanceTruckUseCase {
    private repository: MaintenanceTruckRepositoryGateway

    constructor(maintenanceTruckRepositoryGateway: MaintenanceTruckRepositoryGateway) {
        this.repository = maintenanceTruckRepositoryGateway
    }

    async createMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields,
    ): Promise<MaintenanceTruckDto> {
        const entity = new MaintenanceTruckEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityCreated = await this.repository.createMaintenanceTruckInLocalDatabase(entity)
        return new MaintenanceTruckDto().entityToDto(entityCreated)
    }
    async updateMaintenanceTruckInLocalDatabase(
        dto: MaintenanceTruckDto,
        changeErrorFields: ChangeErrorFields,
    ): Promise<MaintenanceTruckDto> {
        const entity = new MaintenanceTruckEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityUpdated = await this.repository.createMaintenanceTruckInLocalDatabase(entity)
        return new MaintenanceTruckDto().entityToDto(entityUpdated)
    }
    async deleteMaintenanceTruckInLocalDatabase(
        id: string,
        workEquipmentId: string,
        userId: string,
    ): Promise<void> {
        return await this.repository.deleteMaintenanceTruckInLocalDatabase(id, workEquipmentId, userId)
    }
    async findMaintenanceTruckByIdInLocalDatabase(
        id: string,
        enterpriseId: string,
        workId: string,
    ): Promise<MaintenanceTruckDto | null> {
        const result = await this.repository.findMaintenanceTruckByIdInLocalDatabase(id, enterpriseId, workId)
        if (!result) {
            return null
        }
        return new MaintenanceTruckDto().entityToDto(result)
    }
    saveMaintenanceTruckServerId(dtos: MaintenanceTruckDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
    ): Promise<MaintenanceTruckDto[]> {
        const entities =
            await this.repository.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId,
            )
        return entities.map((entity) => new MaintenanceTruckDto().entityToDto(entity))
    }
    async loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string,
    ): Promise<MaintenanceTruckDto[]> {
        const entities =
            await this.repository.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                workId,
            )
        return entities.map((entity) => new MaintenanceTruckDto().entityToDto(entity))
    }
}
