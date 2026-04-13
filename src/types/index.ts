import DepositDto from '../domin/entity/deposit/DepositDto'
import EquipmentDto from '../domin/entity/equipment/EquipmentDto'
import { FuelSupplyDto } from '../domin/entity/fuel-supply/FuelSupplyDto'
import HourMeterMonitoringDto from '../domin/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { MaintenanceTruckDto } from '../domin/entity/maintenance-truck/MaintenanceTruckDto'
import MaterialTransportDto from '../domin/entity/material-transport/MaterialTransportDto'
import { MaterialDto } from '../domin/entity/material/MaterialDto'
import TransportVehicleDto from '../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../domin/entity/work-equipment/WorkEquipmentDto'
import WorkRoutesDto from '../domin/entity/work-routes/WorkRoutesDto'
import WorkDto from '../domin/entity/work/WorkDto'

export type ChangeErrorFields = (name: string) => (value: string) => void

export enum UserRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MAINTENANCE_TRUCK = 'MAINTENANCE_TRUCK',
}

export enum UserAction {
    CREATE = 0,
    UPDATE = 1,
    DELETE = 2,
}

export enum Reference {
    VOLUME = 1,
    WEIGHT = 2,
}

export enum MenuEquipmentType {
    WORKS = 'WORKS',
    EQUIPMENTS = 'EQUIPMENTS',
    MAINTENANCE_TRUCKS = 'MAINTENANCE_TRUCKS',
}

export enum MenuOptionsNotesTypes {
    EQUIPMENT = 'equipment',
    TRANSPORT_VEHICLE = 't_vehicle',
    MAINTENANCE_TRUCK_NOTE = 'maintenance_truck_note',
}

export enum FuelSupplyTypes {
    MAINTENANCE_TRUCK = 'MAINTENANCE_TRUCK',
    GAS_STATION = 'GAS_STATION',
    TRANSPORT_VEHICLE = 't_vehicle',
    EQUIPMENT = 'equipment',
    MAINTENANCE_TRUCK_TANK = 'm_t_tank',
}

export enum DiscountTypes {
    TRANSPORT_VEHICLE = 't_vehicle',
    EQUIPMENT = 'equipment',
}

export enum InvoiceTypes {
    TRANSPORT_VEHICLE = 't_vehicle',
    EQUIPMENT = 'equipment',
}

export type ErrorMessages = {
    field: string
    message: string
}

export enum TableName {
    WORKS = 'works',
    WORK_ROUTES = 'work_routes',
    DEPOSITS = 'deposits',
    EQUIPMENTS = 'equipments',
    WORK_EQUIPMENTS = 'work_equipments',
    MATERIAL_TRANSPORTS = 'material_transports',
    TRANSPORT_VEHICLES = 'transport_vehicles',
    FUEL_SUPPLYS = 'fuel_supplies',
    DISCOUNTS = 'discounts',
    HOUR_METER_MONITORINGS = 'hour_meter_monitorings',
    MAINTENANCE_TRUCKS = 'maintenance_trucks',
    MATERIAL = 'materials',
}

export enum ScreenNames {
    welcome = 'Welcome',
    WORKS = 'Works',
    NEW_WORK = 'New Works',
    EDIT_WORK = 'Edit Works',
    WORK_ROUTES = 'Work Routes',
    EDIT_WORK_ROUTE = 'Edit Work Routes',
    NEW_WORK_ROUTE = 'New Work Routes',

    MATERIALS = 'Materials',
    EDIT_MATERIAL = 'Edit Material',
    NEW_MATERIAL = 'New Material',

    DEPOSITS = 'Deposits',
    EDIT_DEPOSIT = 'Edit Deposit',
    NEW_DEPOSIT = 'New Deposit',

    EQUIPMENT = 'equipment',
    EQUIPMENTS = 'equipments',
    WORK_EQUIPMENTS = 'Escolha os equipamentos',
    WORK_EQUIPMENTS_LIST = 'Equipamentos da obra',
    NEW_EQUIPMENT = 'new equipment',
    EDIT_EQUIPMENT = 'edit equipment',
    BANK_INFO_EQUIPMENT = 'Bank info Equipment',
    TRANSPORT_OF_MATERIALS = 'Transport of materials',
    FUEL_SUPPLIES = 'Fuel supples',
    FUEL_SUPPLY_LIST = 'Fuel supply List',
    NEW_FUEL_SUPPLY = 'New Fuel supply',
    EDIT_FUEL_SUPPLY = 'Edit Fuel supply',
    DISCOUNTS = 'Discounts',
    DISCOUNTS_LIST = 'Discounts List',
    NEW_DISCOUNTS = 'New Discounts',
    EDIT_DISCOUNTS = 'Edit Discounts',
    HOUR_METER_MONITORINGS = 'Hour Meter Monitorings',
    HOUR_METER_MONITORINGS_LIST = 'Hour Meter Monitorings List',
    EDIT_HOUR_METER_MONITORING = 'Edit Hour Meter Monitoring',
    NEW_HOUR_METER_MONITORING = 'New Hour Meter Monitoring',
    MAINTENANCE_TRUCKS = 'Maintenance Trucks',
    MAINTENANCE_TRUCKS_LIST = 'Maintenance Trucks List',
    NEW_MAINTENANCE_TRUCKS = 'New Maintenance Trucks',
    MAINTENANCE_TRUCK_FUEL_TANK = 'Maintenance trucks Fuel Tank',
    NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY = 'New Maintenance trucks Fuel Tank',
    MAINTENANCE_TRUCK_REFUEL_TANK = 'Maintenance Trucks Refuel Tank',
    MAINTENANCE_TRUCK_FUEL_SUPPLIES = 'Maintenance Trucks Fuel Supplies',
    MAINTENANCE_TRUCK_FUEL_SUPPLY_LIST = 'Maintenance Trucks Fuel Supplies List',
    NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY = 'New Maintenance Trucks New Refuel Supplies',
    TRANSPORT_VEHICLES = 'Transport Vehicles',
    NEW_TRANSPORT_VEHICLE = 'New Transport Vehicle',
    EDIT_TRANSPORT_VEHICLE = 'Edit Transport Vehicle',
    BANK_INFO_TRANSPORT_VEHICLE = 'Bank info Transport Vehicle',
    TRANSPORT_NOTE = 'Transport note',
    TRANSPORT_NOTE_LIST = 'Transport Note List',
    NEW_TRANSPORT_NOTE = 'New Transport Note',
    TRANSPORT_DETAILS = 'Transport Details',
    NOTES = 'Notes',

    FINANCIAL = 'Financial',
    GENERATE_INVOICE = 'Generate Invoice',
    NEW_INVOICE = 'New Invoice',
    MANAGE_INVOICE = 'Manage Invoice',
    INVOICE_DETAILS = 'Invoice Details',
}

export enum ScreenTitles {
    WORKS = 'Obras',
    NEW_WORK = 'Nova Obra',
    EDIT_WORK = 'Editar Obra',
    WORK_ROUTES = 'Rotas',
    EDIT_WORK_ROUTE = 'Editar Rota',
    NEW_WORK_ROUTE = 'Nova Rota',

    MATERIALS = 'Materiais',
    EDIT_MATERIAL = 'Editar Material',
    NEW_MATERIAL = 'Novo Material',

    DEPOSITS = 'Jazidas',
    EDIT_DEPOSIT = 'Editar Jazida',
    NEW_DEPOSIT = 'Nova Jazida',

    EQUIPMENTS = 'Equipamentos',
    NEW_EQUIPMENT = 'Cadastrar Equipamento',
    EDIT_EQUIPMENT = '',
    BANK_INFO_EQUIPMENT = 'Informações de pagamento',
    WORK_EQUIPMENTS = 'Escolha os equipamentos',
    WORK_EQUIPMENTS_LIST = 'Equipamentos da obra',
    TRANSPORT_OF_MATERIALS = 'transport_of_materials',
    FUEL_SUPPLIES = 'Abastecimentos',
    FUEL_SUPPLY_LIST = 'Abastecimentos',
    EDIT_FUEL_SUPPLY = 'Editar Abastecimento',
    NEW_FUEL_SUPPLY = 'Novo Abastecimento',
    DISCOUNTS = 'discounts',
    DISCOUNTS_LIST = 'Lista de desconto',
    NEW_DISCOUNT = 'Novo desconto',
    EDIT_DISCOUNT = 'Editar desconto',
    HOUR_METER_MONITORINGS = 'Apontamentos de Horímetro',
    HOUR_METER_MONITORINGS_LIST = 'Apontamentos de Horímetro',
    NEW_HOUR_METER_MONITORING = 'Novo Horímetro',
    EDIT_HOUR_METER_MONITORING = 'Editar Horímetro',
    MAINTENANCE_TRUCKS = 'Melosas',
    MAINTENANCE_TRUCKS_LIST = 'Melosas',
    NEW_MAINTENANCE_TRUCKS = 'Cadastrar Melosa',
    TRANSPORT_VEHICLES = 'Escolha uma Obra',
    NEW_TRANSPORT_VEHICLE = 'Cadastro de Caçambas',
    EDIT_TRANSPORT_VEHICLE = 'Editar Caçamba',
    BANK_INFO_TRANSPORT_VEHICLE = 'Informações de Pagamento',
    TRANSPORT_NOTE = 'Caçambas',
    TRANSPORT_NOTE_LIST = 'Apontamentos',
    NEW_TRANSPORT_NOTE = 'Novo Apontamento',
    TRANSPORT_DETAILS = 'Transport Details',
    //Abastecimento do caminhão de manutenção
    MAINTENANCE_TRUCK_FUEL_TANK = 'Escolha uma Melosa',
    NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY = 'New Maintenance trucks Fuel Tank',
    MAINTENANCE_TRUCK_FUEL_SUPPLIES = 'Abastecimentos',
    MAINTENANCE_TRUCK_FUEL_SUPPLY_LIST = 'Lista de Abastecimentos',
    MAINTENANCE_TRUCK_REFUEL_TANK = 'Abastecimentos do Tanque',
    NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY = 'Novo Abastecimentos do Tanque',

    FINANCIAL = 'Financeiro',
    GENERATE_INVOICE = 'Gerar Fatura',
    NEW_INVOICE = 'Nova Fatura',
    MANAGE_INVOICE = 'Gerenciar Faturas',
    INVOICE_DETAILS = 'Fatura',
}

export enum InvoiceStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELED = 'canceled',
}

export enum ModelSyncType {
    FUEL_SUPPLES = 'fuel_supples',
}

export type MaintenanceTruckFuelSupplyListType = {
    fuelSupply: FuelSupplyDto
    serverId: number
    id: string
    workId: string
    transportVehicleOrWorkEquipmentId: string
    observation: string
    quantity: number
    isDiscount: boolean
    status: string
    modelOrPlate: string
    nameProprietary: string
    operatorMotorist: string
}

type ScreensWithParams = {
    [ScreenNames.EDIT_WORK]: { work: WorkDto }
    [ScreenNames.WORK_ROUTES]: { workId: string }
    [ScreenNames.EDIT_WORK_ROUTE]: { workRoute: WorkRoutesDto }
    [ScreenNames.NEW_WORK_ROUTE]: { workId: string }
    [ScreenNames.MATERIALS]: { depositId: string }
    [ScreenNames.NEW_DEPOSIT]: { depositId: string }
    [ScreenNames.EDIT_DEPOSIT]: { deposit: DepositDto }
    [ScreenNames.EDIT_MATERIAL]: { material: MaterialDto }
    [ScreenNames.NEW_MATERIAL]: { depositId: string }
    [ScreenNames.WORK_EQUIPMENTS_LIST]: { workId: string }
    [ScreenNames.BANK_INFO_EQUIPMENT]: { equipment: EquipmentDto }
    [ScreenNames.EDIT_EQUIPMENT]: { equipment: EquipmentDto }
    [ScreenNames.MAINTENANCE_TRUCKS]: { workId: string }
    [ScreenNames.NEW_MAINTENANCE_TRUCKS]: { workId: string; workEquipmentIds: string[] }
    [ScreenNames.WORK_EQUIPMENTS]: { workId: string; equipmentsSelectedIds: string[] }
    [ScreenNames.EDIT_TRANSPORT_VEHICLE]: { transportVehicleId: string }
    [ScreenNames.NEW_TRANSPORT_VEHICLE]: { workId: string }
    [ScreenNames.BANK_INFO_TRANSPORT_VEHICLE]: { transportVehicleId: string }
    [ScreenNames.DISCOUNTS]: { type: DiscountTypes }
    [ScreenNames.FUEL_SUPPLIES]: { type: FuelSupplyTypes }
    [ScreenNames.FUEL_SUPPLY_LIST]: {
        type: FuelSupplyTypes
        transportVehicleOrWorkEquipmentId: string
        workId: string
    }
    [ScreenNames.NEW_FUEL_SUPPLY]: {
        type: FuelSupplyTypes
        transportVehicleOrWorkEquipmentId: string
        workId: string
    }

    [ScreenNames.EDIT_FUEL_SUPPLY]: {
        fuelSupply: FuelSupplyDto
    }
    [ScreenNames.TRANSPORT_NOTE_LIST]: { workId: string; transportVehicle: TransportVehicleDto }
    [ScreenNames.NEW_TRANSPORT_NOTE]: { transportVehicle: TransportVehicleDto }
    [ScreenNames.TRANSPORT_DETAILS]: { materialTransport: MaterialTransportDto }
    [ScreenNames.DISCOUNTS_LIST]: {
        type: DiscountTypes
        transportVehicleOrWorkEquipmentId: string
        workId: string
    }

    [ScreenNames.NEW_DISCOUNTS]: {
        type: DiscountTypes
        transportVehicleOrWorkEquipmentId: string
        workId: string
    }
    [ScreenNames.EDIT_DISCOUNTS]: {
        discountId: string
    }

    [ScreenNames.HOUR_METER_MONITORINGS_LIST]: {
        workEquipment: WorkEquipmentDto
        workId: string
    }

    [ScreenNames.NEW_HOUR_METER_MONITORING]: {
        workEquipment: WorkEquipmentDto
    }

    [ScreenNames.EDIT_HOUR_METER_MONITORING]: {
        hourMeterMonitoring: HourMeterMonitoringDto
    }

    [ScreenNames.MAINTENANCE_TRUCK_REFUEL_TANK]: {
        maintenanceTruck: MaintenanceTruckDto
        workId: string
    }

    [ScreenNames.MAINTENANCE_TRUCK_FUEL_SUPPLIES]: {
        maintenanceTruck: MaintenanceTruckDto
    }
    [ScreenNames.NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY]: {
        maintenanceTruck: MaintenanceTruckDto
        type: FuelSupplyTypes
        workId: string
    }
    [ScreenNames.NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY]: {
        maintenanceTruck: MaintenanceTruckDto
        workId: string
    }
    [ScreenNames.GENERATE_INVOICE]: {
        transportVehicleOrWorkEquipment: WorkEquipmentDto | TransportVehicleDto
        workId: string
        type: InvoiceTypes
    }
    [ScreenNames.NEW_INVOICE]: {
        transportVehicleOrWorkEquipment: WorkEquipmentDto | TransportVehicleDto
        workId: string
        type: InvoiceTypes
        startDate: number
        endDate: number
    }
    [ScreenNames.MANAGE_INVOICE]: {
        workId: string
        type: InvoiceTypes
    }
    [ScreenNames.INVOICE_DETAILS]: {
        workId: string
        invoiceId: string
    }
}

export type RootStackParamList = {
    [K in ScreenNames]: K extends keyof ScreensWithParams ? ScreensWithParams[K] : undefined
}

export type PeripheralServices = {
    peripheralId: string
    serviceId: string
    transfer: string
    receive: string
}

export interface StrippedPeripheral {
    name?: string
    localName?: string
    rssi: number
    id: string
}
