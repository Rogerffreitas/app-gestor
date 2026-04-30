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
    userId: string
    userAction?: number
    enterpriseId: string
    id?: string
    serverId?: number
    isValid?: boolean
    createdAt?: number
    updatedAt?: number
    status?: string

    get currentHourMeterOrOdometer(): number {
        return this.equipment.hourMeterOrOdometer
    }

    entityToDto(data: WorkEquipmentEntity): WorkEquipmentDto {
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
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.createdAt)
        this.status = data.status
        this.equipment = new EquipmentDto().entityToDto(data.equipment)
        return this
    }
}
