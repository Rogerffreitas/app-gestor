// 1. Importações de Gateways e Adaptadores
import { SynchronizeWatermelonDBAdapter } from '@/src/adapter/SynchronizeWatermelonDBAdapter'
import { DepositServicesImpl } from '@/src/domin/services/impl/DepositServicesImpl'
import { DiscountServicesImpl } from '@/src/domin/services/impl/DiscountServicesImpl'
import { EquipmentServicesImpl } from '@/src/domin/services/impl/EquipmentServicesImpl'
import { FuelSupplyServicesImpl } from '@/src/domin/services/impl/FuelSupplyServicesImpl'
import { HourMeterMonitoringServicesImpl } from '@/src/domin/services/impl/HourMeterMonitoringServicesImpl'
import { InvoiceServicesImpl } from '@/src/domin/services/impl/InvoiceServicesImpl'
import { MaintenanceTruckServicesImpl } from '@/src/domin/services/impl/MaintenanceTruckServicesImpl'
import { MaterialServicesImpl } from '@/src/domin/services/impl/MaterialServicesImpl'
import { MaterialTransportServicesImpl } from '@/src/domin/services/impl/MaterialTransportServicesImpl'
import { TransportVehicleServicesImpl } from '@/src/domin/services/impl/TransportVehicleServicesImpl'
import { WorkEquipmentServicesImpl } from '@/src/domin/services/impl/WorkEquipmentServicesImpl'
import { WorkRoutesServicesImpl } from '@/src/domin/services/impl/WorkRoutesServicesImpl'
import { DepositWatermelonDbRepository } from '../repositories/DepositWatermelonDbRepository'
import { DiscountWatermelonDbRepository } from '../repositories/DiscountWatermelonDbRepository'
import { EquipmentWatermelonDbResitory } from '../repositories/EquipmentWatermelonDbResitory'
import { FuelSupplyWatermelonDbRepository } from '../repositories/FuelSupplyWatermelonDbRepository'
import { HourMeterMonitoringWatermelonDbRepository } from '../repositories/HourMeterMonitoringWatermelonDbRepository'
import { InvoiceApiRepositoryGateway } from '../repositories/InvoiceApiRepositoryGateway'
import { MaintenanceTruckWatermelonDbRepository } from '../repositories/MaintenanceTruckWatermelonDbRepository'
import { MaterialTransportWatermelonDbRepository } from '../repositories/MaterialTransportWatermelonDbRepository'
import { MaterialWatermelonDbRepository } from '../repositories/MaterialWatermelonDbRepository'
import { TransportVehicleWatermelonDbRepository } from '../repositories/TransportVehicleWatermelonDbRepository'
import { WorkEquipmentWatermelonDbRepository } from '../repositories/WorkEquipmentWatermelonDbRepository'
import { WorkRoutesWatermelonDbRepository } from '../repositories/WorkRoutesWatermelonDbRepository'
import { AxiosHttpClientAdapter } from '@/src/adapter/AxiosHttpClientAdapter'
import { SyncWatermelonDbRepository } from '../repositories/SyncWatermelonDbRepository'
import { WorkWatermelonDbRepository } from '../repositories/WorkWatermelonDbRepository'
import { SyncServicesImpl } from '@/src/domin/services/impl/SyncServicesImpl'
import { UserServicesImpl } from '@/src/domin/services/impl/UserServicesImpl'
import { WorkServicesImpl } from '@/src/domin/services/impl/WorkServicesImpl'
import { AuthServicesImpl } from '@/src/domin/services/impl/AuthServicesImpl'

const httpClientGateway = new AxiosHttpClientAdapter()

// Repositórios
const syncRepositoryGateway = new SyncWatermelonDbRepository()
const workRepositoryGateway = new WorkWatermelonDbRepository()
const workEquipmentRepositoryGateway = new WorkEquipmentWatermelonDbRepository()
const workRoutesRepositoryGateway = new WorkRoutesWatermelonDbRepository()
const depositRepositoryGateway = new DepositWatermelonDbRepository()
const discountRepositoryGateway = new DiscountWatermelonDbRepository()
const equipmentRepositoryGateway = new EquipmentWatermelonDbResitory()
const fuelSupplyRepositoryGateway = new FuelSupplyWatermelonDbRepository()
const hourMeterMonitoringRepositoryGateway = new HourMeterMonitoringWatermelonDbRepository()
const maintenanceTruckRepositoryGateway = new MaintenanceTruckWatermelonDbRepository()
const materialRepositoryGateway = new MaterialWatermelonDbRepository()
const materialTransportRepositoryGateway = new MaterialTransportWatermelonDbRepository()
const transportVehicleReposirotyGateway = new TransportVehicleWatermelonDbRepository()
const invoiceRepositoryGateway = new InvoiceApiRepositoryGateway(httpClientGateway)

// Adaptadores Específicos
const syncAdapter = new SynchronizeWatermelonDBAdapter(syncRepositoryGateway)

// Serviços (Injetando as instâncias criadas acima no construtor)
const syncServices = new SyncServicesImpl(syncAdapter)
const userServices = new UserServicesImpl(httpClientGateway) // Ajuste conforme seu construtor
const workServices = new WorkServicesImpl(workRepositoryGateway, httpClientGateway)
const workEquipmentServices = new WorkEquipmentServicesImpl(workEquipmentRepositoryGateway)
const workRoutesServices = new WorkRoutesServicesImpl(workRoutesRepositoryGateway)
const depositServices = new DepositServicesImpl(depositRepositoryGateway)
const discountServices = new DiscountServicesImpl(discountRepositoryGateway)
const equipmentServices = new EquipmentServicesImpl(equipmentRepositoryGateway)
const fuelSupplyServices = new FuelSupplyServicesImpl(fuelSupplyRepositoryGateway)
const hourMeterMonitoringServices = new HourMeterMonitoringServicesImpl(hourMeterMonitoringRepositoryGateway)
const maintenanceTruckServices = new MaintenanceTruckServicesImpl(maintenanceTruckRepositoryGateway)
const materialServices = new MaterialServicesImpl(materialRepositoryGateway)
const materialTransportServices = new MaterialTransportServicesImpl(materialTransportRepositoryGateway)
const transportVehicleServices = new TransportVehicleServicesImpl(transportVehicleReposirotyGateway)
const invoiceServices = new InvoiceServicesImpl(invoiceRepositoryGateway)
const authServices = new AuthServicesImpl(httpClientGateway)

// --- CONTAINER DE EXPOSIÇÃO ---

export const container = {
    AuthServices: authServices,
    HttpClientGateway: httpClientGateway,
    SyncRepositoryGateway: syncRepositoryGateway,
    SyncAdapter: syncAdapter,
    SyncServices: syncServices,
    UserServices: userServices,
    WorkServices: workServices,
    WorkRepositoryGateway: workRepositoryGateway,
    WorkEquipmentServices: workEquipmentServices,
    WorkEquipmentRepositoryGateway: workEquipmentRepositoryGateway,
    WorkRoutesServices: workRoutesServices,
    WorkRoutesRepositoryGateway: workRoutesRepositoryGateway,
    DepositServices: depositServices,
    DepositRepositoryGateway: depositRepositoryGateway,
    DiscountServices: discountServices,
    DiscountRepositoryGateway: discountRepositoryGateway,
    EquipmentServices: equipmentServices,
    EquipmentRepositoryGateway: equipmentRepositoryGateway,
    FuelSupplyServices: fuelSupplyServices,
    FuelSupplyRepositoryGateway: fuelSupplyRepositoryGateway,
    HourMeterMonitoringServices: hourMeterMonitoringServices,
    HourMeterMonitoringRepositoryGateway: hourMeterMonitoringRepositoryGateway,
    MaintenanceTruckServices: maintenanceTruckServices,
    MaintenanceTruckRepositoryGateway: maintenanceTruckRepositoryGateway,
    MaterialServices: materialServices,
    MaterialRepositoryGateway: materialRepositoryGateway,
    MaterialTransportServices: materialTransportServices,
    MaterialTransportRepositoryGateway: materialTransportRepositoryGateway,
    TransportVehicleServices: transportVehicleServices,
    TransportVehicleReposirotyGateway: transportVehicleReposirotyGateway,
    InvoiceServices: invoiceServices,
    InvoiceRepositoryGateway: invoiceRepositoryGateway,
} as const

export type ContainerTypes = typeof container
