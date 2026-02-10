import BuilderAbstractEntity from '../BuilderAbstractEntity'
import DepositEntity from './DepositEntity'

export default class DepositBuilder implements BuilderAbstractEntity {
    private entity: DepositEntity
    constructor() {
        this.entity = new DepositEntity()
    }

    name(name: string): this {
        this.entity.name = name
        return this
    }

    description(description: string): this {
        this.entity.description = description
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

    public build(): DepositEntity {
        return this.entity
    }
}
