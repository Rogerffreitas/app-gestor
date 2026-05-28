import { Database, Model } from '@nozbe/watermelondb'
import { SyncPushResponse } from '../../interfaces/SyncPushResponse'
import { TableName } from '../../types'
import { SyncResponseRepositoryGateway } from '@gestor/domain/application/gateways/SyncResponseRepositoryGateway'

export class SyncWatermelonDbRepository implements SyncResponseRepositoryGateway {
    private readonly database: Database
    constructor(db: Database) {
        this.database = db
    }
    async saveAllServerIds(syncData: SyncPushResponse): Promise<void> {
        //console.log(syncData)
        try {
            await this.database.write(async () => {
                const allPreparedUpdates: Model[] = []
                const tableMap: Record<keyof SyncPushResponse, string> = {
                    transportVehicles: TableName.TRANSPORT_VEHICLES,
                    workEquipments: TableName.WORK_EQUIPMENTS,
                    materialTransports: TableName.MATERIAL_TRANSPORTS,
                    works: TableName.WORKS,
                    workRoutes: TableName.WORK_ROUTES,
                    materials: TableName.MATERIAL,
                    discounts: TableName.DISCOUNTS,
                    fuelSupplies: TableName.FUEL_SUPPLYS,
                    equipments: TableName.EQUIPMENTS,
                    hourMeterMonitorings: TableName.HOUR_METER_MONITORINGS,
                    maintenanceTrucks: TableName.MAINTENANCE_TRUCKS,
                    deposits: TableName.DEPOSITS,
                }

                for (const [key, entities] of Object.entries(syncData)) {
                    //console.log(key)
                    const tableName = tableMap[key as keyof SyncPushResponse]

                    if (tableName && entities && entities.length > 0) {
                        //console.log('table name')
                        //console.log(tableName)
                        //console.log('entities')
                        //console.log(entities)
                        const collection = this.database.get(tableName)

                        const prepared = await Promise.all(
                            entities.map(async (item: any) => {
                                try {
                                    const record = await collection.find(item.id)
                                    return record.prepareUpdate((model: any) => {
                                        model.serverId = item.serverId
                                        model._raw._status = 'synced'
                                    })
                                } catch (e) {
                                    console.warn(
                                        `[Sync] Registro ${item.id} não encontrado na tabela ${tableName}`
                                    )
                                    return null
                                }
                            })
                        )

                        // Filtrar possíveis nulos (caso um ID não exista localmente)
                        allPreparedUpdates.push(...(prepared.filter((p) => p !== null) as Model[]))
                    }
                }

                if (allPreparedUpdates.length > 0) {
                    await this.database.batch(...allPreparedUpdates)
                    console.log(`[Sync] Sucesso: ${allPreparedUpdates.length} registros atualizados.`)
                }
            })
        } catch (error) {
            console.error('[Sync Error]: Falha crítica na sincronização', error)
            throw new Error(`Erro ao processar IDs do servidor: ${error}`)
        }
    }

    async saveServerId(data: any, modelName): Promise<void> {
        //console.log(data)
        try {
            await this.database.write(async () => {
                const tableMap: Record<keyof SyncPushResponse, string> = {
                    transportVehicles: TableName.TRANSPORT_VEHICLES,
                    workEquipments: TableName.WORK_EQUIPMENTS,
                    materialTransports: TableName.MATERIAL_TRANSPORTS,
                    works: TableName.WORKS,
                    workRoutes: TableName.WORK_ROUTES,
                    materials: TableName.MATERIAL,
                    discounts: TableName.DISCOUNTS,
                    fuelSupplies: TableName.FUEL_SUPPLYS,
                    equipments: TableName.EQUIPMENTS,
                    hourMeterMonitorings: TableName.HOUR_METER_MONITORINGS,
                    maintenanceTrucks: TableName.MAINTENANCE_TRUCKS,
                    deposits: TableName.DEPOSITS,
                }

                const tableName = tableMap[modelName as keyof SyncPushResponse]

                if (tableName) {
                    console.log('table name')
                    console.log(tableName)
                    const collection = this.database.get(tableName)

                    try {
                        const record = await collection.find(data.id)
                        return record.update((model: any) => {
                            model.serverId = data.server_id
                            model._raw._status = 'synced'
                        })
                    } catch (e) {
                        console.warn(`[Sync] Registro ${data.id} não encontrado na tabela ${tableName}`)
                        return null
                    }
                }
            })
        } catch (error) {
            console.error('[Sync Error]: Falha crítica na sincronização', error)
            throw new Error(`Erro ao processar IDs do servidor: ${error}`)
        }
    }
}
