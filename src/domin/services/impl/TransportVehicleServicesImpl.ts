import { ChangeErrorFields } from '../../../types'
import { TransportVehicleGateway } from '../../application/gateways/TransportVehicleReposirotyGateway'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import TransportVehicleDto from '../../entity/transport-vehicle/TransportVehicleDto'
import { TransportVehicleEntity } from '../../entity/transport-vehicle/TransportVehicleEntity'
import { TransportVehicleServices } from '../interfaces/TransportVehicleServices'

export class TransportVehicleServicesImpl implements TransportVehicleServices {
    private repository: TransportVehicleGateway

    constructor(transportVehicleGateway: TransportVehicleGateway) {
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
        const entity = await this.repository.findTransportVehicleByIdInLocalDatabase(id)
        return new TransportVehicleDto().entityToDto(entity)
    }
    saveTransportVehicleServerId(dtos: TransportVehicleDto[]): void {
        throw new Error('Method not implemented.')
    }
    loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleDto[]> {
        throw new Error('Method not implemented.')
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
