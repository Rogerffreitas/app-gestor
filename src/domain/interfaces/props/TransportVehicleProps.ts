import { UserAction } from '../../types'

export default interface TransportVehicleProps {
    // Dados específicos do Veículo de Transporte
    motorist: string
    plate: string
    color: string
    capacity: number
    workId: string

    // Dados para instanciar Proprietary (achatados)
    nameProprietary: string
    cpfCnpjProprietary: string
    telProprietary: string

    // Dados para instanciar BankInformation (achatados)
    bank: string
    beneficiary: string
    agency: string
    account: string
    pix: string

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
