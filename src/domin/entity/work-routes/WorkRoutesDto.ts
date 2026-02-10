import DepositDto from '../deposit/DepositDto'
import WorkDto from '../work/WorkDto'
import WorkRoutesEntity from './WorkRoutesEntity'

export default class WorkRoutesDto {
    arrivalLocation: string
    departureLocation: string
    km: number
    initialPicket: number
    value: number
    isFixedValue: boolean
    work: WorkDto
    deposit: DepositDto

    serverId: number
    userId: string
    userAction: number
    enterpriseId: string
    isValid: boolean
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    entityToDto?(data: WorkRoutesEntity): WorkRoutesDto {
        this.arrivalLocation = data.arrivalLocation
        this.departureLocation = data.departureLocation
        this.km = data.km
        this.initialPicket = data.initialPicket
        this.value = data.value
        this.isFixedValue = data.isFixedValue
        this.work = data.work
        this.deposit = data.deposit
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
