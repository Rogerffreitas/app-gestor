import { Container } from 'inversify'
import { TYPES } from './types'
import { AxiosHttpClientAdapter } from '../../adapter/AxiosHttpClientAdapter'
import { AuthServicesImpl } from '../../domin/services/impl/AuthServicesImpl'
import { WorkServices } from '../../domin/services/interfaces/WorkServices'
import { WorkServicesImpl } from '../../domin/services/impl/WorkServicesImpl'
import { SyncServicesImpl } from '../../domin/services/impl/SyncServicesImpl'
import { WorkRepositoryGateway } from '../../domin/application/gateways/WorkRepositoryGateway'
import { WorkWatermelonDbRepository } from '../repositories/WorkWatermelonDbRepository'
import { SyncWatermelonDbRepository } from '../repositories/SyncWatermelonDbRepository'
import { UserServices } from '../../domin/services/interfaces/UserServices'
import { UserServicesImpl } from '../../domin/services/impl/UserServicesImpl'
import { WorkEquipmentServices } from '../../domin/services/interfaces/WorkEquipmentServices'
import { WorkEquipmentServicesImpl } from '../../domin/services/impl/WorkEquipmentServicesImpl'
import { DepositRepositoryGateway } from '../../domin/application/gateways/DepositRepositoryGateway'
import { DiscountRepositoryGateway } from '../../domin/application/gateways/DiscountRepositoryGateway'
import { EquipmentRepositoryGateway } from '../../domin/application/gateways/EquipmentRepositoryGateway'
import { FuelSupplyRepositoryGateway } from '../../domin/application/gateways/FuelSupplyRepositoryGateway'
import { HourMeterMonitoringRepositoryGateway } from '../../domin/application/gateways/HourMeterMonitoringRepositoryGateway'
import { MaintenanceTruckRepositoryGateway } from '../../domin/application/gateways/MaintenanceTruckRepositoryGateway'
import { MaterialRepositoryGateway } from '../../domin/application/gateways/MaterialRepositoryGateway'
import { MaterialTransportRepositoryGateway } from '../../domin/application/gateways/MaterialTransportRepositoryGateway'
import { WorkEquipmentRepositoryGateway } from '../../domin/application/gateways/WorkEquipmentRepositoryGateway'
import { WorkRoutesRepositoryGateway } from '../../domin/application/gateways/WorkRoutesRepositoryGateway'
import { DepositServicesImpl } from '../../domin/services/impl/DepositServicesImpl'
import { HourMeterMonitoringServicesImpl } from '../../domin/services/impl/HourMeterMonitoringServicesImpl'
import { MaintenanceTruckServicesImpl } from '../../domin/services/impl/MaintenanceTruckServicesImpl'
import { MaterialServicesImpl } from '../../domin/services/impl/MaterialServicesImpl'
import { MaterialTransportServicesImpl } from '../../domin/services/impl/MaterialTransportServicesImpl'
import { TransportVehicleServicesImpl } from '../../domin/services/impl/TransportVehicleServicesImpl'
import { WorkRoutesServicesImpl } from '../../domin/services/impl/WorkRoutesServicesImpl'
import { DepositServices } from '../../domin/services/interfaces/DepositServices'
import { DiscountServices } from '../../domin/services/interfaces/DiscountServices'
import { EquipmentServices } from '../../domin/services/interfaces/EquipmentServices'
import { FuelSupplyServices } from '../../domin/services/interfaces/FuelSupplyServices'
import { HourMeterMonitoringServices } from '../../domin/services/interfaces/HourMeterMonitoringServices'
import { MaintenanceTruckServices } from '../../domin/services/interfaces/MaintenanceTruckServices'
import { MaterialServices } from '../../domin/services/interfaces/MaterialServices'
import { MaterialTransportServices } from '../../domin/services/interfaces/MaterialTransportServices'
import { TransportVehicleServices } from '../../domin/services/interfaces/TransportVehicleServices'
import { WorkRoutesServices } from '../../domin/services/interfaces/WorkRoutesServices'
import { DepositWatermelonDbRepository } from '../repositories/DepositWatermelonDbRepository'
import { DiscountWatermelonDbRepository } from '../repositories/DiscountWatermelonDbRepository'
import { FuelSupplyWatermelonDbRepository } from '../repositories/FuelSupplyWatermelonDbRepository'
import { HourMeterMonitoringWatermelonDbRepository } from '../repositories/HourMeterMonitoringWatermelonDbRepository'
import { MaintenanceTruckWatermelonDbRepository } from '../repositories/MaintenanceTruckWatermelonDbRepository'
import { MaterialTransportWatermelonDbRepository } from '../repositories/MaterialTransportWatermelonDbRepository'
import { MaterialWatermelonDbRepository } from '../repositories/MaterialWatermelonDbRepository'
import { TransportVehicleWatermelonDbRepository } from '../repositories/TransportVehicleWatermelonDbRepository'
import { WorkEquipmentWatermelonDbRepository } from '../repositories/WorkEquipmentWatermelonDbRepository'
import { WorkRoutesWatermelonDbRepository } from '../repositories/WorkRoutesWatermelonDbRepository'
import { EquipmentWatermelonDbResitory } from '../repositories/EquipmentWatermelonDbResitory'
import { TransportVehicleReposirotyGateway } from '../../domin/application/gateways/TransportVehicleReposirotyGateway'
import { SynchronizeWatermelonDBAdapter } from '../../adapter/SynchronizeWatermelonDBAdapter'
import { HttpClientGateway } from '../../domin/application/gateways/HttpClientGateway'
import { SyncRepositoryGateway } from '../../domin/application/gateways/SyncRepositoryGateway'
import { SyncAdapter } from '../../domin/application/infra/SyncAdapter'
import { DiscountServicesImpl } from '../../domin/services/impl/DiscountServicesImpl'
import { EquipmentServicesImpl } from '../../domin/services/impl/EquipmentServicesImpl'
import { FuelSupplyServicesImpl } from '../../domin/services/impl/FuelSupplyServicesImpl'
import { AuthServices } from '../../domin/services/interfaces/AuthServices'
import { SyncServices } from '../../domin/services/interfaces/SyncService'
import { InvoiceServicesImpl } from '../../domin/services/impl/InvoiceServicesImpl'
import { InvoiceServices } from '../../domin/services/interfaces/InvoiceServices'
import { InvoiceRepositoryGateway } from '../../domin/application/gateways/InvoiceRepositoryGateway'
import { InvoiceApiRepositoryGateway } from '../repositories/InvoiceApiRepositoryGateway'

const container = new Container({ defaultScope: 'Singleton' })
container.bind<HttpClientGateway>(TYPES.HttpClientGateway).to(AxiosHttpClientAdapter).inSingletonScope()
container.bind<SyncRepositoryGateway>(TYPES.SyncRepositoryGateway).to(SyncWatermelonDbRepository)
container.bind<SyncAdapter>(TYPES.SyncAdapter).to(SynchronizeWatermelonDBAdapter)
container.bind<SyncServices>(TYPES.SyncServices).to(SyncServicesImpl).inSingletonScope()

container.bind<AuthServices>(TYPES.AuthServices).to(AuthServicesImpl)
container.bind<UserServices>(TYPES.UserServices).to(UserServicesImpl)

container.bind<WorkServices>(TYPES.WorkServices).to(WorkServicesImpl)
container.bind<WorkRepositoryGateway>(TYPES.WorkRepositoryGateway).to(WorkWatermelonDbRepository)

container.bind<WorkEquipmentServices>(TYPES.WorkEquipmentServices).to(WorkEquipmentServicesImpl)
container
    .bind<WorkEquipmentRepositoryGateway>(TYPES.WorkEquipmentRepositoryGateway)
    .to(WorkEquipmentWatermelonDbRepository)

container.bind<WorkRoutesServices>(TYPES.WorkRoutesServices).to(WorkRoutesServicesImpl)
container
    .bind<WorkRoutesRepositoryGateway>(TYPES.WorkRoutesRepositoryGateway)
    .to(WorkRoutesWatermelonDbRepository)

container.bind<DepositServices>(TYPES.DepositServices).to(DepositServicesImpl)
container.bind<DepositRepositoryGateway>(TYPES.DepositRepositoryGateway).to(DepositWatermelonDbRepository)

container.bind<DiscountServices>(TYPES.DiscountServices).to(DiscountServicesImpl)
container.bind<DiscountRepositoryGateway>(TYPES.DiscountRepositoryGateway).to(DiscountWatermelonDbRepository)

container.bind<EquipmentServices>(TYPES.EquipmentServices).to(EquipmentServicesImpl)
container.bind<EquipmentRepositoryGateway>(TYPES.EquipmentRepositoryGateway).to(EquipmentWatermelonDbResitory)

container.bind<FuelSupplyServices>(TYPES.FuelSupplyServices).to(FuelSupplyServicesImpl)
container
    .bind<FuelSupplyRepositoryGateway>(TYPES.FuelSupplyRepositoryGateway)
    .to(FuelSupplyWatermelonDbRepository)

container
    .bind<HourMeterMonitoringServices>(TYPES.HourMeterMonitoringServices)
    .to(HourMeterMonitoringServicesImpl)
container
    .bind<HourMeterMonitoringRepositoryGateway>(TYPES.HourMeterMonitoringRepositoryGateway)
    .to(HourMeterMonitoringWatermelonDbRepository)

container.bind<MaintenanceTruckServices>(TYPES.MaintenanceTruckServices).to(MaintenanceTruckServicesImpl)
container
    .bind<MaintenanceTruckRepositoryGateway>(TYPES.MaintenanceTruckRepositoryGateway)
    .to(MaintenanceTruckWatermelonDbRepository)

container.bind<MaterialServices>(TYPES.MaterialServices).to(MaterialServicesImpl)
container.bind<MaterialRepositoryGateway>(TYPES.MaterialRepositoryGateway).to(MaterialWatermelonDbRepository)

container.bind<MaterialTransportServices>(TYPES.MaterialTransportServices).to(MaterialTransportServicesImpl)
container
    .bind<MaterialTransportRepositoryGateway>(TYPES.MaterialTransportRepositoryGateway)
    .to(MaterialTransportWatermelonDbRepository)

container.bind<TransportVehicleServices>(TYPES.TransportVehicleServices).to(TransportVehicleServicesImpl)
container
    .bind<TransportVehicleReposirotyGateway>(TYPES.TransportVehicleReposirotyGateway)
    .to(TransportVehicleWatermelonDbRepository)
container.bind<InvoiceServices>(TYPES.InvoiceServices).to(InvoiceServicesImpl)
container.bind<InvoiceRepositoryGateway>(TYPES.InvoiceRepositoryGateway).to(InvoiceApiRepositoryGateway)

export { container }
