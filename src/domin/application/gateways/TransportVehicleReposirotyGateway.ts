import { BankInformation } from '../../entity/bank-information/BankInformation'
import { TransportVehicleEntity } from '../../entity/transport-vehicle/TransportVehicleEntity'

export interface TransportVehicleGateway {
    createTransportVehicleInLocalDatabase(entity: TransportVehicleEntity): Promise<TransportVehicleEntity>
    updateTransportVehicleInLocalDatabase(entity: TransportVehicleEntity): Promise<TransportVehicleEntity>
    deleteTransportVehicleInLocalDatabase(id: string, userId: string): Promise<void>
    findTransportVehicleByIdInLocalDatabase(id: string): Promise<TransportVehicleEntity | null>
    saveTransportVehicleServerId(entities: TransportVehicleEntity[]): void
    loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleEntity[]>
    loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleEntity[]>
    updateTransportVehicleBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<TransportVehicleEntity>
}
