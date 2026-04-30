import { UserAction } from '../../types'

export default interface DepositProps {
    name: string
    description: string

    serverId: number
    id: string
    userId: string
    userAction: UserAction
    enterpriseId: string
    isValid: boolean
    createdAt: number
    updatedAt: number
    status: string
}
