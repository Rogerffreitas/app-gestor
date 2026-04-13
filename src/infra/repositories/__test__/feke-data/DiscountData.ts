import DiscountEntity from '../../../../domin/entity/discount/DiscountEntity'
import { DiscountTypes } from '../../../../types'

export const discountEntityT = {
    value: 100,
    description: 'peça',
    typ_e: DiscountTypes.TRANSPORT_VEHICLE,
    transportVehicleOrWorkEquipmentId: 't-1',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as DiscountEntity

export const discountEntityEQ = {
    value: 100,
    description: 'peça',
    typ_e: DiscountTypes.EQUIPMENT,
    transportVehicleOrWorkEquipmentId: 'eq-1',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as DiscountEntity
