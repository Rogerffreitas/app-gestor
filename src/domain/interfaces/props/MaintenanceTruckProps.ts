import { UserAction } from '../../types'

export default interface MaintenanceTruckProps {
    // Dados específicos do Caminhão de Manutenção/Comboio
    capacity: number
    operatorMotorist: string
    nameProprietary: string
    modelOrPlate: string
    usersList: string // Geralmente uma string de IDs ou nomes separados por vírgula
    workEquipmentId: string
    workId: string

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
