export const TYPES = {
    // --- Core / Infra ---
    HttpClientGateway: Symbol.for('HttpClientGateway'),
    SyncServices: Symbol.for('SyncServices'),
    SyncRepositoryGateway: Symbol.for('SyncRepositoryGateway'),
    SyncAdapter: Symbol.for('SyncAdapter'),

    // --- Auth & User ---
    AuthServices: Symbol.for('AuthServices'),
    UserServices: Symbol.for('UserServices'),

    // --- Work & Operations ---
    WorkServices: Symbol.for('WorkServices'),
    WorkRepositoryGateway: Symbol.for('WorkRepositoryGateway'),

    WorkEquipmentServices: Symbol.for('WorkEquipmentServices'),
    WorkEquipmentRepositoryGateway: Symbol.for('WorkEquipmentRepositoryGateway'),

    WorkRoutesServices: Symbol.for('WorkRoutesServices'),
    WorkRoutesRepositoryGateway: Symbol.for('WorkRoutesRepositoryGateway'),

    // --- Materials & Transport ---
    DepositServices: Symbol.for('DepositServices'),
    DepositRepositoryGateway: Symbol.for('DepositRepositoryGateway'),

    MaterialServices: Symbol.for('MaterialServices'),
    MaterialRepositoryGateway: Symbol.for('MaterialRepositoryGateway'),

    MaterialTransportServices: Symbol.for('MaterialTransportServices'),
    MaterialTransportRepositoryGateway: Symbol.for('MaterialTransportRepositoryGateway'),

    TransportVehicleServices: Symbol.for('TransportVehicleServices'),
    TransportVehicleReposirotyGateway: Symbol.for('TransportVehicleReposirotyGateway'),

    // --- Equipment & Maintenance ---
    EquipmentServices: Symbol.for('EquipmentServices'),
    EquipmentRepositoryGateway: Symbol.for('EquipmentRepositoryGateway'),

    MaintenanceTruckServices: Symbol.for('MaintenanceTruckServices'),
    MaintenanceTruckRepositoryGateway: Symbol.for('MaintenanceTruckRepositoryGateway'),

    HourMeterMonitoringServices: Symbol.for('HourMeterMonitoringServices'),
    HourMeterMonitoringRepositoryGateway: Symbol.for('HourMeterMonitoringRepositoryGateway'),

    FuelSupplyServices: Symbol.for('FuelSupplyServices'),
    FuelSupplyRepositoryGateway: Symbol.for('FuelSupplyRepositoryGateway'),

    DiscountServices: Symbol.for('DiscountServices'),
    DiscountRepositoryGateway: Symbol.for('DiscountRepositoryGateway'),

    InvoiceServices: Symbol.for('InvoiceServices'),
    InvoiceRepositoryGateway: Symbol.for('InvoiceRepositoryGateway'),
}
