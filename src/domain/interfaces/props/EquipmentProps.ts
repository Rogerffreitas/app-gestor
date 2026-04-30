import { UserAction } from '../../types'

export default interface EquipmentProps {
    operatorMotorist: string
    isEquipment: boolean
    modelOrPlate: string

    // Dados de Aluguel (RentInformation)
    hourMeterOrOdometer: number
    startRental: string
    monthlyPayment: number
    valuePerHourKm: number
    valuePerDay: number

    // Dados do Proprietário (Proprietary)
    nameProprietary: string
    cpfCnpjProprietary: string
    telProprietary: string

    // Dados Bancários (BankInformation)
    bank: string
    beneficiary: string
    agency: string
    account: string
    pix: string

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
