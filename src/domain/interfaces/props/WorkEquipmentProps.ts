import { UserAction } from '../../types'
import EquipmentProps from './EquipmentProps'

export default interface WorkEquipmentProps {
    // Relacionamento com Equipment
    equipment: EquipmentProps

    // Dados de Aluguel (achatados para o RentInformation)
    hourMeterOrOdometer: number
    startRental: string
    monthlyPayment: number
    valuePerHourKm: number
    valuePerDay: number

    // Dados básicos do vínculo com a Obra
    operatorMotorist: string
    workId: string

    // Propriedades herdadas de AbstractEntity
    serverId: number
    id: string
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    createdAt: number
    updatedAt: number
    status: string
}
