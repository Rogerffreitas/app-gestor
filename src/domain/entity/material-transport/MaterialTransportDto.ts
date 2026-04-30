import { InvoiceStatus } from '../../types'
import { MaterialDto } from '../material/MaterialDto'
import TransportVehicleDto from '../transport-vehicle/TransportVehicleDto'
import WorkRoutesDto from '../work-routes/WorkRoutesDto'
import { MaterialTransportEntity } from './MaterialTransportEntity'

export default class MaterialTransportDto {
    workRoutes: WorkRoutesDto
    transportVehicle: TransportVehicleDto
    material: MaterialDto

    quantity: number
    deliveryPicket: string
    totalPickets: number

    observation: string

    workId: string
    userId: string
    enterpriseId: string
    serverId?: number
    userAction?: number
    isValid?: boolean
    invoiceId?: number
    invoiceStatus?: InvoiceStatus
    value?: number
    isReferenceCapacity?: boolean
    distanceTraveledWithinTheWork?: number
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public fromDto(entity: MaterialTransportEntity): MaterialTransportDto {
        this.workRoutes = new WorkRoutesDto().entityToDto(entity.workRoutes)
        this.transportVehicle = new TransportVehicleDto().entityToDto(entity.transportVehicle)
        this.material = new MaterialDto().entityToDto(entity.material)

        this.value = entity.value
        this.isReferenceCapacity = entity.isReferenceCapacity
        this.quantity = entity.quantity
        this.deliveryPicket = entity.deliveryPicket
        this.totalPickets = entity.totalPickets
        this.distanceTraveledWithinTheWork = entity.distanceTraveledWithinTheWork
        this.observation = entity.observation
        this.invoiceId = entity.invoiceId
        this.invoiceStatus = entity.invoiceStatus
        this.workId = entity.workId
        this.serverId = entity.serverId
        this.userId = entity.userId
        this.userAction = entity.userAction
        this.enterpriseId = entity.enterpriseId
        this.isValid = entity.isValid
        this.id = entity.id
        this.createdAt = Number(entity.createdAt)
        this.updatedAt = Number(entity.createdAt)
        this.status = entity.status
        return this
    }
}
