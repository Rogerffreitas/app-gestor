import { ChangeErrorFields } from '../types'
import { BankInformation } from '../entity/bank-information/BankInformation'
import TransportVehicleDto from '../entity/transport-vehicle/TransportVehicleDto'
import { TransportVehicleEntity } from '../entity/transport-vehicle/TransportVehicleEntity'
import { TransportVehicleUseCase } from '../use-cases/TransportVehicleUseCase'
import { TransportVehicleRepositoryGateway } from '../application/gateways/TransportVehicleRepositoryGateway'

export class TransportVehicleInteractor implements TransportVehicleUseCase {
    private repository: TransportVehicleRepositoryGateway

    constructor(transportVehicleGateway: TransportVehicleRepositoryGateway) {
        this.repository = transportVehicleGateway
    }
    async updateTransportVehicleBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<TransportVehicleDto> {
        const result = await this.repository.updateTransportVehicleBankInformation(id, bankInformation)
        return new TransportVehicleDto().entityToDto(result)
    }

    async createTransportVehicleInLocalDatabase(
        dto: TransportVehicleDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<TransportVehicleDto> {
        const entity = new TransportVehicleEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityCreated = await this.repository.createTransportVehicleInLocalDatabase(entity)
        return new TransportVehicleDto().entityToDto(entityCreated)
    }
    async updateTransportVehicleInLocalDatabase(
        dto: TransportVehicleDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<TransportVehicleDto> {
        const entity = new TransportVehicleEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const entityUpdated = await this.repository.updateTransportVehicleInLocalDatabase(entity)
        return new TransportVehicleDto().entityToDto(entityUpdated)
    }
    async deleteTransportVehicleInLocalDatabase(id: string, userId: string): Promise<void> {
        await this.repository.deleteTransportVehicleInLocalDatabase(id, userId)
    }
    async findTransportVehicleByIdInLocalDatabase(id: string): Promise<TransportVehicleDto> {
        const result = await this.repository.findTransportVehicleByIdInLocalDatabase(id)
        return new TransportVehicleDto().entityToDto(result)
    }

    async loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleDto[]> {
        const entities =
            await this.repository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId
            )
        return entities.map((entity) => new TransportVehicleDto().entityToDto(entity))
    }
    async loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleDto[]> {
        const entities =
            await this.repository.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                enterpriseId,
                workId
            )
        return entities.map((entity) => new TransportVehicleDto().entityToDto(entity))
    }
}
