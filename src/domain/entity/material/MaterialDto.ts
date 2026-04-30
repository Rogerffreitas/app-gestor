import { Reference, UserAction } from '../../types'
import MaterialEntity from './MaterialEntity'

export class MaterialDto {
    name: string
    density: number
    referenceMaterialCalculation: Reference
    value: number
    depositId: string

    serverId?: number
    userId: string
    userAction?: UserAction
    enterpriseId: string
    isValid?: boolean
    id?: string
    createdAt?: number
    updatedAt?: number

    status?: string

    entityToDto(data: MaterialEntity): MaterialDto {
        this.name = data.name
        this.density = data.density
        this.referenceMaterialCalculation = data.referenceMaterialCalculation
        this.value = data.value
        this.depositId = data.depositId
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = Number(data.createdAt)
        this.updatedAt = Number(data.createdAt)
        this.status = data.status
        return this
    }
}
