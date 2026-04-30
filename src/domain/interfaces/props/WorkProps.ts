import { UserAction } from '../../types'

export default interface WorkProps {
    name: string
    description: string
    pickets: number
    usersList: string

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
