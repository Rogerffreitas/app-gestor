import DepositModel from '@/src/database/model/DepositModel'
import EquipmentModel from '@/src/database/model/EquipmentModel'
import HourMeterMonitoringModel from '@/src/database/model/HourMeterMonitoringModel'
import MaintenanceTruckModel from '@/src/database/model/MaintenanceTruckModel'
import MaterialModel from '@/src/database/model/MaterialModel'
import MaterialTransportModel from '@/src/database/model/MaterialTransportModel'
import TransportVehicleModel from '@/src/database/model/TransportVehicleModel'
import WorkEquipmentModel from '@/src/database/model/WorkEquipmentModel'
import WorkModel from '@/src/database/model/WorkModel'
import WorkRouteModel from '@/src/database/model/WorkRouteModel'
import DepositProps from '@gestor/domain/interfaces/props/DepositProps'
import EquipmentProps from '@gestor/domain/interfaces/props/EquipmentProps'
import HourMeterMonitoringProps from '@gestor/domain/interfaces/props/HourMeterMonitoringProps'
import MaintenanceTruckProps from '@gestor/domain/interfaces/props/MaintenanceTruckProps'
import MaterialProps from '@gestor/domain/interfaces/props/MaterialProps'
import MaterialTransportProps from '@gestor/domain/interfaces/props/MaterialTransportProps'
import TransportVehicleProps from '@gestor/domain/interfaces/props/TransportVehicleProps'
import WorkEquipmentProps from '@gestor/domain/interfaces/props/WorkEquipmentProps'
import WorkProps from '@gestor/domain/interfaces/props/WorkProps'
import WorkRoutesProps from '@gestor/domain/interfaces/props/WorkRoutesProps'
import { InvoiceStatus, Reference } from '@gestor/domain/types'

export default class Mappers {
    static transportVehicleMapper(model: TransportVehicleModel): TransportVehicleProps {
        return {
            // Dados básicos do veículo
            motorist: model.motorist,
            plate: model.plate,
            color: model.color,
            capacity: model.capacity,
            workId: model.workId,

            // Dados do Proprietário (Flattened)
            nameProprietary: model.nameProprietary,
            cpfCnpjProprietary: model.cpfCnpjProprietary,
            telProprietary: model.telProprietary,

            // Dados Bancários (Flattened)
            bank: model.bank,
            beneficiary: model.beneficiary,
            agency: model.agency,
            account: model.account,
            pix: model.pix,

            // Propriedades da AbstractEntity
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static materialMapper(model: MaterialModel): MaterialProps {
        return {
            // Dados específicos do Material
            name: model.name,
            density: model.density,

            // Mapeia a referência de cálculo (Peso ou Volume)
            referenceMaterialCalculation: model.referenceMaterialCalculation as Reference,

            value: model.value ?? 0,
            depositId: model.depositId,

            // Propriedades da AbstractEntity (Base)
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static workMapper(model: WorkModel): WorkProps {
        return {
            // Dados específicos da Obra
            name: model.name,
            description: model.description,
            pickets: model.pickets,
            usersList: model.usersList,

            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static depositMapper(model: DepositModel): DepositProps {
        return {
            name: model.name,
            description: model.description,

            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static async workRoutesMapper(model: WorkRouteModel): Promise<WorkRoutesProps> {
        return {
            // Localização e Trajeto
            arrivalLocation: model.arrivalLocation,
            departureLocation: model.departureLocation,
            km: model.km,
            initialPicket: model.initialPicket,

            // Valores e Flags
            value: model.value,
            isFixedValue: model.isFixedValue,

            work: Mappers.workMapper(await model.work()),
            deposit: Mappers.depositMapper(await model.deposit()),

            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static async materialTransportMapper(model: MaterialTransportModel): Promise<MaterialTransportProps> {
        return {
            route: await Mappers.workRoutesMapper(await model.workRoutes()),
            transportVehicle: Mappers.transportVehicleMapper(await model.transportVehicle()),
            material: Mappers.materialMapper(await model.material()),

            value: model.value,
            isReferenceCapacity: model.isReferenceCapacity,
            quantity: model.quantity,
            deliveryPicket: model.deliveryPicket,
            totalPickets: model.totalPickets,
            distanceTraveledWithinTheWork: model.distanceTraveledWithinTheWork,
            observation: model.observation,
            invoiceId: model.invoiceId,
            invoiceStatus: model.invoiceStatus as InvoiceStatus,
            workId: model.workId,

            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static equipmentMapper(model: EquipmentModel): EquipmentProps {
        return {
            operatorMotorist: model.operatorMotorist,
            isEquipment: model.isEquipment,
            modelOrPlate: model.modelOrPlate,
            // RentInformation
            hourMeterOrOdometer: model.hourMeterOrOdometer,
            startRental: model.startRental,
            monthlyPayment: model.monthlyPayment,
            valuePerHourKm: model.valuePerHourKm,
            valuePerDay: model.valuePerDay,
            // Proprietary
            nameProprietary: model.nameProprietary,
            cpfCnpjProprietary: model.cpfCnpjProprietary,
            telProprietary: model.telProprietary,
            // Bank
            bank: model.bank,
            beneficiary: model.beneficiary,
            agency: model.agency,
            account: model.account,
            pix: model.pix,
            // Base
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static async workEquipmentMapper(model: WorkEquipmentModel): Promise<WorkEquipmentProps> {
        return {
            equipment: this.equipmentMapper(await model.equipment()),

            // Dados de Aluguel (Flattened para o RentInformation)
            hourMeterOrOdometer: 0,
            startRental: model.startRental,
            monthlyPayment: model.monthlyPayment,
            valuePerHourKm: model.valuePerHourKm,
            valuePerDay: model.valuePerDay,

            // Dados básicos do vínculo
            operatorMotorist: model.operatorMotorist,
            workId: model.workId,

            // Propriedades da AbstractEntity
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static maintenanceTruckMapper(model: MaintenanceTruckModel): MaintenanceTruckProps {
        return {
            // Dados específicos do Caminhão de Manutenção/Comboio
            capacity: model.capacity,
            operatorMotorist: model.operatorMotorist,
            nameProprietary: model.nameProprietary,
            modelOrPlate: model.modelOrPlate,
            usersList: model.usersList,
            workEquipmentId: model.workEquipmentId,
            workId: model.workId,

            // Propriedades herdadas de AbstractEntity
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }

    static async hourMeterMonitoringMapper(
        model: HourMeterMonitoringModel
    ): Promise<HourMeterMonitoringProps> {
        return {
            date: model.date,
            initialHourMeterValue: model.initialHourMeterValue,
            currentHourMeterValue: model.currentHourMeterValue,
            totalCalculatedInThePeriodInformed: model.totalCalculatedInThePeriodInformed,
            workEquipment: await this.workEquipmentMapper(await model.workEquipment()),
            value: model.value,
            invoiceId: model.invoiceId,
            invoiceStatus: model.invoiceStatus as InvoiceStatus,
            workId: model.workId,
            observation: model.observation,

            // Propriedades herdadas de AbstractEntity
            serverId: model.serverId,
            id: model.id,
            userId: model.userId,
            userAction: model.userAction,
            enterpriseId: model.enterpriseId,
            isValid: model.isValid,
            createdAt: Number(model.createdAt),
            updatedAt: Number(model.updatedAt),
            status: model._raw._status,
        }
    }
}
