import { database } from '../../database'
import { Q } from '@nozbe/watermelondb'
import DiscountModel from '../../database/model/DiscountModel'

import { InvoiceStatus, TableName, UserAction } from '../../types'
import { DiscountRepositoryGateway } from '@gestor/domain/application/gateways/DiscountRepositoryGateway'
import DiscountEntity from '@gestor/domain/entity/discount/DiscountEntity'
import DiscountProps from '@gestor/domain/interfaces/props/DiscountProps'
import { DiscountTypes } from '@gestor/domain/types'

export class DiscountWatermelonDbRepository implements DiscountRepositoryGateway {
    async createDiscountInLocalDatabase(entity: DiscountEntity): Promise<DiscountEntity> {
        console.log('Creating Discount in the database')
        try {
            const entityCreated = await database.write(async () => {
                return await database.get<DiscountModel>(TableName.DISCOUNTS).create((item) => {
                    item.value = +entity.value
                    item.description = entity.description
                    item.discountType = entity.discountType
                    item.transportVehicleOrWorkEquipmentId = entity.transportVehicleOrWorkEquipmentId
                    item.invoiceId = +0
                    item.invoiceStatus = InvoiceStatus.PENDING
                    item.workId = entity.workId
                    item.enterpriseId = entity.enterpriseId
                    item.userId = entity.userId
                    item.userAction = UserAction.CREATE
                    item.isValid = true
                    item.serverId = +0
                })
            })
            if (entityCreated) {
                console.log('Entity created: ' + entityCreated)
                return new DiscountEntity().modelToEntity(this.discountMapper(entityCreated))
            }
        } catch (error) {
            console.log('[Discount]: ' + error)
            throw new Error(`Error create Discount in local database. ${error}`)
        }
    }
    async updateDiscountInLocalDatabase(entity: DiscountEntity): Promise<DiscountEntity> {
        console.log('Updating Discount in the database')
        try {
            const result = await database.write(async () => {
                const item = await database.get<DiscountModel>(TableName.DISCOUNTS).find(entity.id)
                return await item.update((item) => {
                    item.value = +entity.value
                    item.description = entity.description
                    item.userId = entity.userId
                    item.userAction = UserAction.UPDATE
                })
            })
            return new DiscountEntity().modelToEntity(this.discountMapper(result))
        } catch (error) {
            console.log('[Discount]: ' + error)
            throw new Error(`Error updating Discount in local database. ${error}`)
        }
    }
    async deleteDiscountInLocalDatabase(id: string, userId: string): Promise<void> {
        const a = await database
            .get(TableName.DISCOUNTS)
            .query(Q.where('id', id), Q.where('invoice_status', Q.notEq(InvoiceStatus.PENDING)))
            .fetchCount()

        if (a > 0) {
            throw new Error('Não é possível apagar o Desconto')
        }
        await database.write(async () => {
            const result = await database.get<DiscountModel>(TableName.DISCOUNTS).find(id)
            await result.update(() => {
                result.isValid = false
                result.userId = userId
                result.userAction = UserAction.DELETE
            })
        })
    }
    async findDiscountByIdInLocalDatabase(id: string): Promise<DiscountEntity> {
        try {
            const result = await database.get<DiscountModel>(TableName.DISCOUNTS).find(id)
            if (result) {
                return new DiscountEntity().modelToEntity(this.discountMapper(result))
            }
            return null
        } catch (error) {
            console.log('[DiscountRepository]: ' + error)
            throw new Error(`Error loading Discount from local database. ${error}`)
        }
    }
    saveDiscountServerId(entitys: DiscountEntity[]): void {
        throw new Error('Method not implemented.')
    }
    async loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string,
        discountType: string,
        transportVehicleOrWorkEquipmentId: string
    ): Promise<DiscountEntity[]> {
        try {
            const result = await database
                .get<DiscountModel>(TableName.DISCOUNTS)
                .query(
                    Q.sortBy('created_at', Q.desc),
                    Q.where('enterprise_id', enterpriseId),
                    Q.where('work_id', workId),
                    Q.where('is_valid', true),
                    Q.where('transport_vehicle_or_work_equipment_id', transportVehicleOrWorkEquipmentId),
                    Q.where('discount_type', discountType),
                    Q.where('invoice_status', InvoiceStatus.PENDING),
                    Q.where('invoice_id', 0)
                )
                .fetch()
            return await Promise.all(
                result.map(async (item: DiscountModel) => {
                    return new DiscountEntity().modelToEntity(this.discountMapper(item))
                })
            )
        } catch (error) {
            console.log('[DiscountRepository]= ' + error)
            throw new Error(`Error loading Discount from local database. ${error}`)
        }
    }

    private discountMapper(model: DiscountModel): DiscountProps {
        return {
            value: model.value,
            description: model.description,
            discountType: model.discountType as DiscountTypes,
            workId: model.workId,
            transportVehicleOrWorkEquipmentId: model.transportVehicleOrWorkEquipmentId,
            invoiceId: model.invoiceId,
            invoiceStatus: model.invoiceStatus as InvoiceStatus,

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
