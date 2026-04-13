import { database } from '../../database'
import TransportVehicleModel from '../../database/model/TransportVehicleModel'
import { TransportVehicleReposirotyGateway } from '../../domin/application/gateways/TransportVehicleReposirotyGateway'
import { BankInformation } from '../../domin/entity/bank-information/BankInformation'
import { TransportVehicleEntity } from '../../domin/entity/transport-vehicle/TransportVehicleEntity'
import { TableName, UserAction } from '../../types'
import { Q } from '@nozbe/watermelondb'
import { injectable } from 'inversify'

@injectable()
export class TransportVehicleWatermelonDbRepository implements TransportVehicleReposirotyGateway {
    async updateTransportVehicleBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<TransportVehicleEntity> {
        try {
            const modelUpdated = await database.write(async () => {
                const result = await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .find(id)
                return await result.update((item) => {
                    item.bank = bankInformation.bank
                    item.beneficiary = bankInformation.beneficiary
                    item.agency = bankInformation.agency
                    item.account = bankInformation.account
                    item.pix = bankInformation.pix
                })
            })
            return new TransportVehicleEntity().modelToEntity(modelUpdated)
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('An error occurred while updating bank information', { cause: error })
        }
    }
    async createTransportVehicleInLocalDatabase(
        entity: TransportVehicleEntity
    ): Promise<TransportVehicleEntity> {
        console.log('Creating TransportVehicle in the database')
        try {
            const entityCreated = await database.write(async () => {
                return await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .create((item) => {
                        item.nameProprietary = entity.nameProprietary
                        item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                        item.telProprietary = entity.telProprietary
                        item.motorist = entity.motorist
                        item.plate = entity.plate
                        item.color = entity.color
                        item.capacity = entity.capacity
                        item.workId = entity.workId
                        item.enterpriseId = entity.enterpriseId
                        item.userId = entity.userId
                        item.userAction = UserAction.CREATE
                        item.isValid = true
                        item.serverId = 0
                    })
            })
            return new TransportVehicleEntity().modelToEntity(entityCreated)
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('Error create TransportVehicle in local database: ', { cause: error })
        }
    }
    async updateTransportVehicleInLocalDatabase(
        entity: TransportVehicleEntity
    ): Promise<TransportVehicleEntity> {
        console.log('Updating TransportVehicle in the database')
        try {
            const entityUpdated = await database.write(async () => {
                const result = await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .find(entity.id)
                return await result.update((item) => {
                    item.nameProprietary = entity.nameProprietary
                    item.cpfCnpjProprietary = entity.cpfCnpjProprietary
                    item.telProprietary = entity.telProprietary
                    item.motorist = entity.motorist
                    item.plate = entity.plate
                    item.color = entity.color
                    item.capacity = entity.capacity
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new TransportVehicleEntity().modelToEntity(entityUpdated)
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('An error occurred while updating transport vehicle', { cause: error })
        }
    }
    async deleteTransportVehicleInLocalDatabase(id: string, userId: string): Promise<void> {
        const [transportCount, fuelCount, discountCount] = await Promise.all([
            database
                .get(TableName.MATERIAL_TRANSPORTS)
                .query(Q.where('transport_vehicle_id', id))
                .fetchCount(),
            database
                .get(TableName.FUEL_SUPPLYS)
                .query(Q.where('transport_vehicle_or_work_equipment_id', id))
                .fetchCount(),
            database
                .get(TableName.DISCOUNTS)
                .query(Q.where('transport_vehicle_or_work_equipment_id', id))
                .fetchCount(),
        ])

        const totalDependencies = transportCount + fuelCount + discountCount

        if (totalDependencies > 0) {
            throw new Error('Existem registros associados (Transportes, combustível ou descontos).')
        }

        await database.write(async () => {
            const equipment = await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).find(id)
            await equipment.update(() => {
                equipment.userAction = UserAction.DELETE
                equipment.userId = userId
                equipment.isValid = false
            })
        })
    }
    async findTransportVehicleByIdInLocalDatabase(id: string): Promise<TransportVehicleEntity> {
        try {
            const result = await database.get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES).find(id)

            return new TransportVehicleEntity().modelToEntity(result)
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('an error occurred while trying to load model ', { cause: error })
        }
    }
    saveTransportVehicleServerId(entities: TransportVehicleEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleEntity[]> {
        try {
            const result = await database
                .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId)
                )
            return await Promise.all(
                result.map((item: TransportVehicleModel) => {
                    return new TransportVehicleEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('Error loading vehicles from local database.', { cause: error })
        }
    }
    async loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<TransportVehicleEntity[]> {
        try {
            const result = await database
                .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('is_valid', true),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('server_id', Q.gt(0))
                )
            return await Promise.all(
                result.map((item: TransportVehicleModel) => {
                    return new TransportVehicleEntity().modelToEntity(item)
                })
            )
        } catch (error) {
            console.log('[TransportVehicleEntityRepository]: ' + error)
            throw new Error('Error loading vehicles from local database.', { cause: error })
        }
    }

    async updateEquipmentBankInformation(
        id: string,
        bankInformation: BankInformation
    ): Promise<TransportVehicleEntity> {
        try {
            const entityUpdated = await database.write(async () => {
                const result = await database
                    .get<TransportVehicleModel>(TableName.TRANSPORT_VEHICLES)
                    .find(id)
                return await result.update((item) => {
                    item.bank = bankInformation.bank
                    item.beneficiary = bankInformation.beneficiary
                    item.agency = bankInformation.agency
                    item.account = bankInformation.account
                    item.pix = bankInformation.pix
                })
            })
            return new TransportVehicleEntity().modelToEntity(entityUpdated)
        } catch (error) {
            console.log('[Equipment]: ' + error)
            throw new Error('An error occurred while updating bank information', { cause: error })
        }
    }
}
