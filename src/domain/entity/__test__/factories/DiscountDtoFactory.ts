import { DiscountTypes } from '../../../types'
import DiscountDto from '../../discount/DiscountDto'

export class DiscountDtoFactory {
    static create(overrides: Partial<DiscountDto> = {}): DiscountDto {
        const dto = new DiscountDto()

        // Dados padrão
        dto.id = 'discount-123'
        dto.description = 'Desconto de Teste'
        dto.value = 100
        dto.discountType = DiscountTypes.EQUIPMENT
        dto.transportVehicleOrWorkEquipmentId = 'equip-1'
        dto.workId = 'work-1'
        dto.enterpriseId = 'ent-1'
        dto.userId = 'user-1'
        dto.status = 'active'
        dto.createdAt = Date.now()
        dto.updatedAt = Date.now()
        dto.isValid = true

        // Aplica as sobreposições do teste
        return Object.assign(dto, overrides)
    }
}
