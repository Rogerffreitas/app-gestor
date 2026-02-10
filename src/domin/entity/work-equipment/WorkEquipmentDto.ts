import EquipmentDto from '../equipment/EquipmentDto'
import { WorkEquipmentEntity } from './WorkEquipmentEntity'

export default class WorkEquipmentDto {
    equipment: EquipmentDto
    hourMeterOrOdometer: number
    startRental: string
    monthlyPayment: number
    valuePerHourKm: number
    valuePerDay: number
    operatorMotorist: string
    workId: string
    id?: string
    serverId: number
    userId: string
    userAction: number
    enterpriseId: string
    isValid: boolean
    createdAt?: number
    updatedAt?: number
    status?: string

    entityToDto?(data: WorkEquipmentEntity) {
        const equipment = new EquipmentDto().entityToDto(data.equipment)
        this.equipment = equipment
        this.hourMeterOrOdometer = +data.hourMeterOrOdometer
        this.startRental = data.startRental
        this.monthlyPayment = +data.monthlyPayment
        this.valuePerHourKm = +data.valuePerHourKm
        this.valuePerDay = +data.valuePerDay
        this.operatorMotorist = data.operatorMotorist
        this.workId = data.workId
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data.status
        return this
    }
}
