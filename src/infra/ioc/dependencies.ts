// 1. Importações de Gateways e Adaptadores
import { SynchronizeWatermelonDBAdapter } from '@/src/adapter/SynchronizeWatermelonDBAdapter'
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
import { SyncWatermelonDbRepository } from '../repositories/SyncWatermelonDbRepository'
import { WorkWatermelonDbRepository } from '../repositories/WorkWatermelonDbRepository'
import { AxiosHttpClientAdapter } from '@/src/adapter/AxiosHttpClientAdapter'

import { SyncServicesImpl } from '@domin/services/impl/SyncServicesImpl'
import { UserServicesImpl } from '@domin/services/impl/UserServicesImpl'
import { AuthServicesImpl } from '@domin/services/impl/AuthServicesImpl'
import { InvoiceServicesImpl } from '@domin/services/impl/InvoiceServiceImpl'
import { WorkServicesImpl } from '@domin/services/impl/WorkServicesImpl'

import { DepositInteractor } from '@domin/interactors/DepositInteractor'
import { MaterialInteractor } from '@domin/interactors/MaterialInteractor'
import { WorkRoutesInteractor } from '@domin/interactors/WorkRoutesInteractor'
import { EquipmentInteractor } from '@domin/interactors/EquipmentInteractor'
import { WorkEquipmentInteractor } from '@domin/interactors/WorkEquipmentInteractor'
import { MaintenanceTruckInteractor } from '@domin/interactors/MaintenanceTruckInteractor'
import { TransportVehicleInteractor } from '@domin/interactors/TransportVehicleInteractor'
import { MaterialTransportInteractor } from '@domin/interactors/MaterialTransportInteractor'
import { HourMeterMonitoringInteractor } from '@domin/interactors/HourMeterMonitoringInteractor'
import { DiscountInteractor } from '@domin/interactors/DiscountInteractor'
import { FuelSupplyInteractor } from '@domin/interactors/FuelSupplyInteractor'

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
const authServices = new AuthServicesImpl(httpClientGateway)
const invoiceServices = new InvoiceServicesImpl(invoiceRepositoryGateway)
const workServices = new WorkServicesImpl(workRepositoryGateway, httpClientGateway)

// Interectors (Injetando as instâncias criadas acima no construtor)

const depositServices = new DepositInteractor(depositRepositoryGateway)
const materialServices = new MaterialInteractor(materialRepositoryGateway)
const workRoutesServices = new WorkRoutesInteractor(workRoutesRepositoryGateway)
const equipmentServices = new EquipmentInteractor(equipmentRepositoryGateway)
const workEquipmentServices = new WorkEquipmentInteractor(workEquipmentRepositoryGateway)
const maintenanceTruckServices = new MaintenanceTruckInteractor(maintenanceTruckRepositoryGateway)
const transportVehicleServices = new TransportVehicleInteractor(transportVehicleReposirotyGateway)
const materialTransportServices = new MaterialTransportInteractor(materialTransportRepositoryGateway)
const hourMeterMonitoringServices = new HourMeterMonitoringInteractor(hourMeterMonitoringRepositoryGateway)
const discountServices = new DiscountInteractor(discountRepositoryGateway)

const fuelSupplyServices = new FuelSupplyInteractor(fuelSupplyRepositoryGateway)

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
