import BuilderAbstractEntity from '../BuilderAbstractEntity'
import WorkEntity from './WorkEntity'

export default class WorkBuilder implements BuilderAbstractEntity {
    private entity: WorkEntity
    constructor() {
        this.entity = new WorkEntity()
    }

    name(name: string): this {
        this.entity.name = name
        return this
    }

    description(description: string): this {
        this.entity.description = description
        return this
    }

    frames(frames: number): this {
        this.entity.frames = frames
        return this
    }

    usersList(usersList: string): this {
        this.entity.usersList = usersList
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

    public build(): WorkEntity {
        return this.entity
    }
}
