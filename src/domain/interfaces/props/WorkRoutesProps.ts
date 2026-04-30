import { UserAction } from '../../types'
import WorkProps from './WorkProps'
import DepositProps from './DepositProps'

export default interface WorkRoutesProps {
    // Localização e Trajeto
    arrivalLocation: string
    departureLocation: string
    km: number
    initialPicket: number

    // Valores
    value: number
    isFixedValue: boolean

    // Relacionamentos (Objetos aninhados)
    work: WorkProps
    deposit: DepositProps

    // Propriedades herdadas de AbstractEntity
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
