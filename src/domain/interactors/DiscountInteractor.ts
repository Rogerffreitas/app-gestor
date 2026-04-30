import { ChangeErrorFields } from '../types'
import { DiscountRepositoryGateway } from '../application/gateways/DiscountRepositoryGateway'
import DiscountDto from '../entity/discount/DiscountDto'
import DiscountEntity from '../entity/discount/DiscountEntity'
import { DiscountUseCase } from '../use-cases/DiscountUseCase'

export class DiscountInteractor implements DiscountUseCase {
    discountRepositoryGateway: DiscountRepositoryGateway
    constructor(discountRepositoryGateway: DiscountRepositoryGateway) {
        this.discountRepositoryGateway = discountRepositoryGateway
    }

    async createDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto> {
        const entity = new DiscountEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.discountRepositoryGateway.createDiscountInLocalDatabase(entity)
        return new DiscountDto().entityToDto(result)
    }
    async updateDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto> {
        const entity = new DiscountEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.discountRepositoryGateway.updateDiscountInLocalDatabase(entity)
        return new DiscountDto().entityToDto(result)
    }
    deleteDiscountInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.discountRepositoryGateway.deleteDiscountInLocalDatabase(id, userId)
    }
    findDiscountByIdInLocalDatabase(id: string): Promise<DiscountDto> {
        throw new Error('Method not implemented.')
    }
    saveDiscountServerId(dtos: DiscountDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        typ_e: string,
        transportVehicleOrWorkEquipmentId: string
    ): Promise<DiscountDto[]> {
        const result =
            await this.discountRepositoryGateway.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                enterpriseId,
                workId,
                typ_e,
                transportVehicleOrWorkEquipmentId
            )
        return result.map((item) => {
            return new DiscountDto().entityToDto(item)
        })
    }
}
