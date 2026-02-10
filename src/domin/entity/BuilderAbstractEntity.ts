export default interface BuilderAbstractEntity {
    userId(userId: string): this
    userAction(userAction: number): this
    enterpriseId(enterpriseId: string): this
    isValid(isValid: boolean): this
    id(id: string): this
    serverId(serverId: number): this
    updatedAt(updatedAt: number): this
    status(status: string): this
}
