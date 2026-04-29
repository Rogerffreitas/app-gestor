import { FuelSupplyEntity } from '@gestor/domain/entity/fuel-supply/FuelSupplyEntity'
import { FuelSupplyTypes } from '../../../../types'

export const entityTransportVehicle = {
    quantity: 90000,
    valuePerLiter: 560,
    value: 50400,
    description: 'diesel',
    supplyType: FuelSupplyTypes.TRANSPORT_VEHICLE,
    transportVehicleOrWorkEquipmentId: 't-1',
    isGasStation: true,
    maintenanceTrucksWorkEquipmentId: null,
    isDiscount: true,
    observation: 'Abastecimento posto 99',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
    hourMeterOrOdometer: 1,
} as FuelSupplyEntity

export const entityEquipment = {
    quantity: 10000,
    valuePerLiter: 560,
    value: 56000,
    description: 'diesel',
    supplyType: FuelSupplyTypes.EQUIPMENT,
    transportVehicleOrWorkEquipmentId: 'eq-1',
    isGasStation: true,
    maintenanceTrucksWorkEquipmentId: null,
    isDiscount: true,
    observation: 'Abastecimento posto 100',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
    hourMeterOrOdometer: 1,
} as FuelSupplyEntity

export const entityMaintenanceTruckTank = {
    quantity: 20000,
    valuePerLiter: 560,
    value: 112000,
    description: 'diesel',
    supplyType: FuelSupplyTypes.MAINTENANCE_TRUCK_TANK,
    transportVehicleOrWorkEquipmentId: 'eq-2',
    isGasStation: true,
    maintenanceTrucksWorkEquipmentId: 'mt-1',
    isDiscount: false,
    observation: 'Abastecimento do tanque',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
    hourMeterOrOdometer: 1,
} as FuelSupplyEntity

export const entityMaintenanceTruck = {
    quantity: 10000,
    valuePerLiter: 560,
    value: 56000,
    description: 'diesel',
    supplyType: FuelSupplyTypes.EQUIPMENT,
    transportVehicleOrWorkEquipmentId: 'eq-1',
    isGasStation: false,
    maintenanceTrucksWorkEquipmentId: 'mt-1',
    hourMeterOrOdometer: 1,
    isDiscount: false,
    observation: 'Abastecimento de equipamento pela melosa',
    workId: 'work-1',
    enterpriseId: 'enterprise-1',
    userId: 'user-1',
} as FuelSupplyEntity
