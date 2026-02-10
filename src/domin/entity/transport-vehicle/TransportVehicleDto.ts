import { TransportVehicleEntity } from './TransportVehicleEntity'

export default class TransportVehicleDto {
    motorist: string
    plate: string
    color: string
    capacity: number
    workId: string

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

    entityToDto?(data: TransportVehicleEntity): TransportVehicleDto {
        this.motorist = data.motorist
        this.plate = data.plate
        this.color = data.color
        this.capacity = data.capacity
        this.workId = data.workId
        this.nameProprietary = data.nameProprietary
        this.cpfCnpjProprietary = data.cpfCnpjProprietary
        this.telProprietary = data.telProprietary
        this.bank = data.bank
        this.beneficiary = data.beneficiary
        this.agency = data.agency
        this.account = data.account
        this.pix = data.pix
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
