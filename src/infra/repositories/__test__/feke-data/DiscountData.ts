import DiscountEntity from '@gestor/domain/entity/discount/DiscountEntity'
import { DiscountTypes } from '../../../../types'

export const discountEntityT = {
    value: 100,
    description: 'peça',
    transportVehicleOrWorkEquipmentId: 't-1',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as DiscountEntity

export const discountEntityEQ = {
    value: 100,
    description: 'peça',
    transportVehicleOrWorkEquipmentId: 'eq-1',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as DiscountEntity
