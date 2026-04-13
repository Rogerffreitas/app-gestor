import { inject, injectable } from 'inversify'
import { ChangeErrorFields } from '../../../types'
import { DiscountRepositoryGateway } from '../../application/gateways/DiscountRepositoryGateway'
import DiscountDto from '../../entity/discount/DiscountDto'
import DiscountEntity from '../../entity/discount/DiscountEntity'
import { DiscountServices } from '../interfaces/DiscountServices'
import { TYPES } from '../../../infra/ioc/types'

@injectable()
export class DiscountServicesImpl implements DiscountServices {
    constructor(@inject(TYPES.DiscountRepositoryGateway) private repository: DiscountRepositoryGateway) {}

    async createDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto> {
        const entity = new DiscountEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.createDiscountInLocalDatabase(entity)
        return new DiscountDto().entityToDto(result)
    }
    async updateDiscountInLocalDatabase(
        dto: DiscountDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<DiscountDto> {
        const entity = new DiscountEntity().dtoToEntity(dto)
        entity.validate(changeErrorFields)
        const result = await this.repository.updateDiscountInLocalDatabase(entity)
        return new DiscountDto().entityToDto(result)
    }
    deleteDiscountInLocalDatabase(id: string, userId: string): Promise<void> {
        return this.repository.deleteDiscountInLocalDatabase(id, userId)
    }
    async findDiscountByIdInLocalDatabase(id: string): Promise<DiscountDto> {
        return new DiscountDto().entityToDto(await this.repository.findDiscountByIdInLocalDatabase(id))
    }
    saveDiscountServerId(dtos: DiscountDto[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        discountType: string,
        transportVehicleOrWorkEquipmentId: string
    ): Promise<DiscountDto[]> {
        const result = await this.repository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
            enterpriseId,
            workId,
            discountType,
            transportVehicleOrWorkEquipmentId
        )
        return result.map((item) => {
            return new DiscountDto().entityToDto(item)
        })
    }
}
