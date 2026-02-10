import { EquipmentEntity } from './EquipmentEntity'

export default class EquipmentDto {
    hourMeterOrOdometer: number
    startRental: string
    monthlyPayment: number
    valuePerHourKm: number
    valuePerDay: number

    operatorMotorist: string
    isEquipment: boolean
    modelOrPlate: string

    nameProprietary: string
    cpfCnpjProprietary: string
    telProprietary: string

    serverId: number
    userId: string
    userAction: number
    enterpriseId: string
    isValid: boolean

    bank?: string
    beneficiary?: string
    agency?: string
    account?: string
    pix?: string

    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    entityToDto?(data: EquipmentEntity): this {
        this.hourMeterOrOdometer = data.hourMeterOrOdometer
        this.startRental = data.startRental
        this.monthlyPayment = data.monthlyPayment
        this.valuePerHourKm = data.valuePerHourKm
        this.valuePerDay = data.valuePerDay

        this.operatorMotorist = data.operatorMotorist
        this.isEquipment = data.isEquipment
        this.modelOrPlate = data.modelOrPlate

        this.nameProprietary = data.nameProprietary
        this.cpfCnpjProprietary = data.cpfCnpjProprietary
        this.telProprietary = data.telProprietary

        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid

        this.bank = data.bank
        this.beneficiary = data.beneficiary
        this.agency = data.agency
        this.account = data.account
        this.pix = data.pix

        this.id = data.id
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.status = data.status
        return this
    }
}
