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

import { SyncServicesImpl } from '@gestor/domain/services/impl/SyncServicesImpl'
import { UserServicesImpl } from '@gestor/domain/services/impl/UserServicesImpl'
import { AuthServicesImpl } from '@gestor/domain/services/impl/AuthServicesImpl'
import { InvoiceServicesImpl } from '@gestor/domain/services/impl/InvoiceServiceImpl'
import { WorkServicesImpl } from '@gestor/domain/services/impl/WorkServicesImpl'

import { DepositInteractor } from '@gestor/domain/interactors/DepositInteractor'
import { MaterialInteractor } from '@gestor/domain/interactors/MaterialInteractor'
import { WorkRoutesInteractor } from '@gestor/domain/interactors/WorkRoutesInteractor'
import { EquipmentInteractor } from '@gestor/domain/interactors/EquipmentInteractor'
import { WorkEquipmentInteractor } from '@gestor/domain/interactors/WorkEquipmentInteractor'
import { MaintenanceTruckInteractor } from '@gestor/domain/interactors/MaintenanceTruckInteractor'
import { TransportVehicleInteractor } from '@gestor/domain/interactors/TransportVehicleInteractor'
import { MaterialTransportInteractor } from '@gestor/domain/interactors/MaterialTransportInteractor'
import { HourMeterMonitoringInteractor } from '@gestor/domain/interactors/HourMeterMonitoringInteractor'
import { DiscountInteractor } from '@gestor/domain/interactors/DiscountInteractor'
import { FuelSupplyInteractor } from '@gestor/domain/interactors/FuelSupplyInteractor'
import { database } from '@/src/database'

const httpClientGateway = new AxiosHttpClientAdapter()

// Repositórios
const syncRepositoryGateway = new SyncWatermelonDbRepository()
const workRepositoryGateway = new WorkWatermelonDbRepository(database)
const workEquipmentRepositoryGateway = new WorkEquipmentWatermelonDbRepository()
const workRoutesRepositoryGateway = new WorkRoutesWatermelonDbRepository(database)
const depositRepositoryGateway = new DepositWatermelonDbRepository(database)
const discountRepositoryGateway = new DiscountWatermelonDbRepository(database)
const equipmentRepositoryGateway = new EquipmentWatermelonDbResitory()
const fuelSupplyRepositoryGateway = new FuelSupplyWatermelonDbRepository(database)
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
