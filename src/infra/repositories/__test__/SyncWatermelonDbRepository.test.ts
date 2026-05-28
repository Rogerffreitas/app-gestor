import { TableName } from '@/src/types'
import { SyncWatermelonDbRepository } from '../SyncWatermelonDbRepository'
import { database } from './database-test'
import { DiscountWatermelonDbRepository } from '../DiscountWatermelonDbRepository'

describe('SyncWatermelonDbRepository', () => {
    let repository: SyncWatermelonDbRepository
    let discountRepository: DiscountWatermelonDbRepository

    beforeEach(() => {
        repository = new SyncWatermelonDbRepository(database)
        discountRepository = new DiscountWatermelonDbRepository(database)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. SAVE ALL SERVER IDS (BATCH)
    // =========================================================================
    describe('saveAllServerIds', () => {
        it('Should successfully batch update multiple tables with their server IDs and status', async () => {
            const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // 1. Arrange: Cria dados prévios no banco local para simular registros pendentes de sincronização
            const localVehicle = await database.write(async () => {
                return await database.get<any>(TableName.TRANSPORT_VEHICLES).create((item) => {
                    item._raw.id = 'local-vehicle-01'
                    item.serverId = 0
                    item._raw._status = 'created'
                })
            })

            const localWork = await database.write(async () => {
                return await database.get<any>(TableName.WORKS).create((item) => {
                    item._raw.id = 'local-work-02'
                    item.serverId = 0
                    item._raw._status = 'created'
                })
            })

            // Mock do payload que vem do servidor pós-push
            const mockSyncData = {
                transportVehicles: [{ id: localVehicle.id, serverId: 100 }],
                works: [{ id: localWork.id, serverId: 200 }],
                materials: [], // Tabela vazia para garantir estabilidade da iteração
            } as any

            // 2. Act
            await repository.saveAllServerIds(mockSyncData)

            // 3. Assert: Valida persistência e alteração de status internos do WatermelonDB
            const updatedVehicle = await database.get<any>(TableName.TRANSPORT_VEHICLES).find(localVehicle.id)
            expect(updatedVehicle.serverId).toBe(100)
            expect(updatedVehicle._raw._status).toBe('synced')

            const updatedWork = await database.get<any>(TableName.WORKS).find(localWork.id)
            expect(updatedWork.serverId).toBe(200)
            expect(updatedWork._raw._status).toBe('synced')

            expect(logSpy).toHaveBeenCalledWith('[Sync] Sucesso: 2 registros atualizados.')
        })

        it('Should warn and continue gracefully if a server record is missing locally', async () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
            const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

            // 1. Arrange: Cria 1 registro existente e envia 1 inexistente ("ghost") no payload
            const localDeposit = await database.write(async () => {
                return await database.get<any>(TableName.DEPOSITS).create((item) => {
                    item._raw.id = 'local-deposit-10'
                    item.serverId = 0
                })
            })

            const mockSyncData = {
                deposits: [
                    { id: localDeposit.id, serverId: 555 },
                    { id: 'ghost-deposit-99', serverId: 666 }, // Não existe no banco local
                ],
            } as any

            // 2. Act
            await repository.saveAllServerIds(mockSyncData)

            // 3. Assert
            // Garante que o existente foi atualizado mesmo com o outro falhando
            const updatedDeposit = await database.get<any>(TableName.DEPOSITS).find(localDeposit.id)
            expect(updatedDeposit.serverId).toBe(555)

            // Valida o acionamento do try/catch interno (dentro do .map)
            expect(warnSpy).toHaveBeenCalledWith(
                `[Sync] Registro ghost-deposit-99 não encontrado na tabela ${TableName.DEPOSITS}`
            )
            expect(logSpy).toHaveBeenCalledWith('[Sync] Sucesso: 1 registros atualizados.')
        })

        it('Should log a critical error and throw a custom exception if database write fails', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Força um erro crítico zifando o método write do database temporariamente
            jest.spyOn(database, 'write').mockRejectedValueOnce(new Error('Database locked'))

            await expect(repository.saveAllServerIds({ works: [] } as any)).rejects.toThrow(
                /Erro ao processar IDs do servidor:/
            )

            expect(errorSpy).toHaveBeenCalledWith(
                '[Sync Error]: Falha crítica na sincronização',
                expect.any(Error)
            )
        })
    })

    // =========================================================================
    // 2. SAVE SINGLE SERVER ID
    // =========================================================================
    describe('saveServerId', () => {
        it('Should successfully update a single record with server_id (snake_case)', async () => {
            // 1. Arrange: Cria o registro inicial
            const localRoute = await database.write(async () => {
                return await database.get<any>(TableName.WORK_ROUTES).create((item) => {
                    item._raw.id = 'route-abc'
                    item.serverId = 0
                })
            })

            const singleDataPayload = {
                id: 'route-abc',
                server_id: 888, // Nota: Seu método espera 'server_id' e não 'serverId' para gravação unária
            }

            // 2. Act
            await repository.saveServerId(singleDataPayload, 'workRoutes')

            // 3. Assert
            const updatedRoute = await database.get<any>(TableName.WORK_ROUTES).find(localRoute.id)
            expect(updatedRoute.serverId).toBe(888)
            expect(updatedRoute._raw._status).toBe('synced')
        })

        it('Should catch, warn and return null safely if the single record is not found', async () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

            const ghostPayload = { id: 'ghost-id', server_id: 123 }

            // Act
            const result = await repository.saveServerId(ghostPayload, 'discounts')

            // Assert
            expect(result).toBeUndefined()
            expect(warnSpy).toHaveBeenCalledWith(
                `[Sync] Registro ghost-id não encontrado na tabela ${TableName.DISCOUNTS}`
            )
        })

        it('Should catch critical failures at global table level and throw custom exception', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Quebra o método `.get()` do banco para disparar a exceção externa
            jest.spyOn(database, 'get').mockImplementationOnce(() => {
                throw new Error('Fatal connection drop')
            })

            await expect(repository.saveServerId({ id: '123' }, 'works')).rejects.toThrow(
                /Erro ao processar IDs do servidor:/
            )

            expect(errorSpy).toHaveBeenCalledWith(
                '[Sync Error]: Falha crítica na sincronização',
                expect.any(Error)
            )
        })
    })
})
