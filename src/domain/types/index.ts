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

export type ErrorMessages = {
    field: string
    message: string
}

export enum InvoiceStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELED = 'canceled',
}

export enum ModelSyncType {
    FUEL_SUPPLES = 'fuel_supples',
}

export enum TableName {
    WORKS = 'works',
    WORK_ROUTES = 'work_routes',
    DEPOSITS = 'deposits',
    EQUIPMENTS = 'equipments',
    WORK_EQUIPMENTS = 'work_equipments',
    MATERIAL_TRANSPORTS = 'material_transports',
    TRANSPORT_VEHICLES = 'transport_vehicles',
    FUEL_SUPPLIES = 'fuel_supplies',
    DISCOUNTS = 'discounts',
    HOUR_METER_MONITORINGS = 'hour_meter_monitorings',
    MAINTENANCE_TRUCKS = 'maintenance_trucks',
    MATERIAL = 'materials',
}

export enum InvoiceTypes {
    TRANSPORT_VEHICLE = 't_vehicle',
    EQUIPMENT = 'equipment',
}

export type DocDefinitionsTypes = {
    body: any[]
    footer: any[]
    style: any
}

export type SummaryInvoice = {
    startDate: number
    endDate: number
    invoiceType: string
    invoiceStatus: InvoiceStatus
    workId: string
    transportVehicleOrWorkEquipmentId: string
    description: string
    modelOrPlate: string
    id?: string
    serverId?: number
    userId: string
    userAction?: number
    enterpriseId: string
    isValid?: boolean
    bank: string | null
    beneficiary: string | null
    agency: string | null
    account: string | null
    pix: string | null
    createdAt?: number
    updatedAt?: number
    totalTransports: number
    totalDiscounts: number
    totalFuelSupplies: number
}
