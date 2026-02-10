import { ChangeErrorFields } from '../../../types'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import TransportVehicleDto from '../../entity/transport-vehicle/TransportVehicleDto'

export interface TransportVehicleServices {
    createTransportVehicleInLocalDatabase(
        dto: TransportVehicleDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<TransportVehicleDto>
    updateTransportVehicleInLocalDatabase(
        dto: TransportVehicleDto,
        changeErrorFields: ChangeErrorFields
    ): Promise<TransportVehicleDto>
    deleteTransportVehicleInLocalDatabase(id: string, userId: string): Promise<void>
    findTransportVehicleByIdInLocalDatabase(id: string): Promise<TransportVehicleDto | null>
    saveTransportVehicleServerId(dtos: TransportVehicleDto[]): void
    loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleDto[]>
    loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleDto[]>
    updateTransportVehicleBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<TransportVehicleDto>
}
