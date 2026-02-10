import BuilderAbstractEntity from '../BuilderAbstractEntity'
import WorkRoutesEntity from './WorkRoutesEntity'

export default class WorkRoutesBuilder implements BuilderAbstractEntity {
    private entity: WorkRoutesEntity
    constructor() {
        this.entity = new WorkRoutesEntity()
    }

    arrivalLocation(arrivalLocation: string): this {
        this.entity.arrivalLocation = arrivalLocation
        return this
    }

    departureLocation(departureLocation: string): this {
        this.entity.departureLocation = departureLocation
        return this
    }

    km(km: number): this {
        this.entity.km = km
        return this
    }

    frames(frames: number): this {
        this.entity.frames = frames
        return this
    }

    value(value: number): this {
        this.entity.value = value
        return this
    }

    isFixedValue(isFixedValue: boolean): this {
        this.entity.isFixedValue = isFixedValue
        return this
    }

    workId(workId: string): this {
        this.entity.workId = workId
        return this
    }

    depositId(depositId: string): this {
        this.entity.depositId = depositId
        return this
    }

    userId(userId: number): this {
        this.entity.userId = userId
        return this
    }
    userAction(userAction: number): this {
        this.entity.userAction = userAction
        return this
    }
    enterpriseId(enterpriseId: number): this {
        this.entity.enterpriseId = enterpriseId
        return this
    }
    isValid(isValid: boolean): this {
        this.entity.isValid = isValid
        return this
    }
    id(id: string): this {
        this.entity.id = id
        return this
    }
    serverId(serverId: number): this {
        this.entity.serverId = serverId
        return this
    }
    updatedAt(updatedAt: number): this {
        this.entity.updatedAt = updatedAt
        return this
    }

    createdAt(createdAt: number): this {
        this.entity.createdAt = createdAt
        return this
    }

    status(status: string): this {
        this.entity.status = status
        return this
    }

    public build(): WorkRoutesEntity {
        return this.entity
    }
}
