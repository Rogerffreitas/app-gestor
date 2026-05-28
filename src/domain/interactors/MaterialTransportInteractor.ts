import { ChangeErrorFields } from '../types'
import { MaterialTransportRepositoryGateway } from '../application/gateways/MaterialTransportRepositoryGateway'
import MaterialTransportDto from '../entity/material-transport/MaterialTransportDto'
import { MaterialTransportEntity } from '../entity/material-transport/MaterialTransportEntity'
import { MaterialTransportUseCase } from '../use-cases/MaterialTransportUseCase'

export class MaterialTransportInteractor implements MaterialTransportUseCase {
    private repository: MaterialTransportRepositoryGateway

    constructor(repository: MaterialTransportRepositoryGateway) {
        this.repository = repository
    }
    async createMaterialTransportInLocalDatabase(
        dto: MaterialTransportDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<MaterialTransportDto> {
        const entity = new MaterialTransportEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const createdEntity = await this.repository.createMaterialTransportInLocalDatabase(entity)
        return new MaterialTransportDto().fromDto(createdEntity)
    }
    deleteMaterialTransportInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.repository.deleteMaterialTransportInLocalDatabase(id, userId)
    }

    async loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        vehicleId: string
    ): Promise<MaterialTransportDto[]> {
        const entities =
            await this.repository.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
                enterpriseId,
                workId,
                vehicleId
            )
        return entities.map((entity) => new MaterialTransportDto().fromDto(entity))
    }
}
