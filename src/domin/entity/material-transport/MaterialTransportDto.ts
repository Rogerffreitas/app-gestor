import { MaterialDto } from '../material/MaterialDto'
import TransportVehicleDto from '../transport-vehicle/TransportVehicleDto'
import WorkRoutesDto from '../work-routes/WorkRoutesDto'
import { MaterialTransportEntity } from './MaterialTransportEntity'

export default class MaterialTransportDto {
    workRoutesDto: WorkRoutesDto
    transportVehicleDto: TransportVehicleDto
    materialDto: MaterialDto

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
    invoiceStatus?: string
    value?: number
    isReferenceCapacity?: boolean
    distanceTraveledWithinTheWork?: number
    id?: string
    createdAt?: number
    updatedAt?: number
    status?: string

    public static fromDto(entity: MaterialTransportEntity): MaterialTransportDto {
        const dto = new MaterialTransportDto()

        dto.workRoutesDto = new WorkRoutesDto().entityToDto(entity.workRoutes)
        dto.transportVehicleDto = new TransportVehicleDto().entityToDto(entity.transportVehicle)
        dto.materialDto = new MaterialDto().entityToDto(entity.material)

        dto.value = entity.value
        dto.isReferenceCapacity = entity.isReferenceCapacity
        dto.quantity = entity.quantity
        dto.deliveryPicket = entity.deliveryPicket
        dto.totalPickets = entity.totalPickets
        dto.distanceTraveledWithinTheWork = entity.distanceTraveledWithinTheWork
        dto.observation = entity.observation
        dto.invoiceId = entity.invoiceId
        dto.invoiceStatus = entity.invoiceStatus
        dto.workId = entity.workId
        dto.serverId = entity.serverId
        dto.userId = entity.userId
        dto.userAction = entity.userAction
        dto.enterpriseId = entity.enterpriseId
        dto.isValid = entity.isValid
        dto.id = entity.id
        dto.createdAt = entity.createdAt
        dto.updatedAt = entity.updatedAt
        dto.status = entity.status
        return dto
    }
}
