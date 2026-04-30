import { UserAction, Reference } from '../../types'

export default interface MaterialProps {
    // Dados específicos do Material
    name: string
    density: number
    referenceMaterialCalculation: Reference
    value: number
    depositId: string

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
