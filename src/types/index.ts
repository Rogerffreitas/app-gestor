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

export enum FuelSupplyTypes {
    MAINTENANCE_TRUCK = 'MAINTENANCE_TRUCK',
    GAS_STATION = 'GAS_STATION',
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
    FUEL_SUPPLYS = 'fuel_supplys',
    DISCOUNTS = 'discounts',
    HOUR_METER_MONITORINGS = 'hour_meter_monitorings',
    MAINTENANCE_TRUCKS = 'maintenance_trucks',
    MATERIAL = 'materials',
}

export enum ScreenNames {
    welcome = 'welcome',
    WORKS = 'works',
    WORK_ROUTES = 'work_routes',
    DEPOSITS = 'deposits',
    EQUIPMENTS = 'equipments',
    WORK_EQUIPMENTS = 'Escolha os equipamentos',
    WORK_EQUIPMENTS_LIST = 'Equipamentos da obra',
    TRANSPORT_OF_MATERIALS = 'Transport of materials',
    FUEL_SUPPLYS = 'Fuel supplys',
    DISCOUNTS = 'Discounts',
    HOUR_METER_MONITORINGS = 'Hour meter monitorings',
    MAINTENANCE_TRUCKS = 'Melosas',
    MAINTENANCE_TRUCKS_LIST = 'Melosas',
    TRANSPORT_VEHICLES = 'Transport Vehicles',
    NEW_TRANSPORT_VEHICLE = 'New Transport Vehicle',
    EDIT_TRANSPORT_VEHICLE = 'Edit Transport Vehicle',
    BANK_INFO_TRANSPORT_VEHICLE = 'Bank info Transport Vehicle',
    TRANSPORT_NOTE = 'Transport note',
    TRANSPORT_NOTE_LIST = 'Transport Note List',
    NEW_TRANSPORT_NOTE = 'New Transport Note',
    TRANSPORT_DETAILS = 'Transport Details',
    MAINTENANCE_TRUCK_NOTE = 'Maintenance truck note',
    NOTES = 'Notes',
}

export enum ScreenTitles {
    WORKS = 'works',
    WORK_ROUTES = 'work_routes',
    DEPOSITS = 'deposits',
    EQUIPMENTS = 'equipments',
    WORK_EQUIPMENTS = 'Escolha os equipamentos',
    WORK_EQUIPMENTS_LIST = 'Equipamentos da obra',
    TRANSPORT_OF_MATERIALS = 'transport_of_materials',
    FUEL_SUPPLYS = 'fuel_supplys',
    DISCOUNTS = 'discounts',
    HOUR_METER_MONITORINGS = 'hour_meter_monitorings',
    MAINTENANCE_TRUCKS = 'Melosas',
    MAINTENANCE_TRUCKS_LIST = 'Melosas',
    TRANSPORT_VEHICLES = 'Escolha uma Obra',
    NEW_TRANSPORT_VEHICLE = 'Cadastro de Caçambas',
    EDIT_TRANSPORT_VEHICLE = 'Editar Caçamba',
    BANK_INFO_TRANSPORT_VEHICLE = 'Informações de Pagamento',
    TRANSPORT_NOTE = 'Caçambas',
    TRANSPORT_NOTE_LIST = 'Apontamentos',
    NEW_TRANSPORT_NOTE = 'Novo Apontamento',
    TRANSPORT_DETAILS = 'Transport Details',
}

export enum InvoiceStatus {
    PENDING = 'pending',
}
