import { UserAction, InvoiceStatus } from '../../types'
import WorkRoutesProps from './WorkRoutesProps'
import TransportVehicleProps from './TransportVehicleProps'
import MaterialProps from './MaterialProps'

export default interface MaterialTransportProps {
    // Relacionamentos Complexos (Props aninhadas)
    route: WorkRoutesProps // No modelToEntity você usa 'route'
    transportVehicle: TransportVehicleProps
    material: MaterialProps

    // Dados do Transporte
    value: number
    isReferenceCapacity: boolean
    quantity: number
    deliveryPicket?: string
    totalPickets: number
    distanceTraveledWithinTheWork: number
    observation?: string

    // Faturamento e Obra
    invoiceId: number
    invoiceStatus: InvoiceStatus
    workId: string

    // Propriedades da AbstractEntity
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
