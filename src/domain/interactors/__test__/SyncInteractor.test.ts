import SyncRepositoryGateway from '../../application/gateways/SyncRepositoryGateway'
import { SyncPullResponse, SyncPushRequest, SyncPushResponse } from '../../interfaces/Sync'
import SyncInteractor from '../SyncInteractor'

describe('SyncInteractor', () => {
    let interactor: SyncInteractor
    let mockRepository: jest.Mocked<SyncRepositoryGateway>
    let consoleInfoSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()

        // Evita que os logs fiquem sujando o terminal do Jest
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

        // Mock do Gateway de Sincronização
        mockRepository = {
            manuallySyncing: jest.fn(),
            push: jest.fn(),
            pull: jest.fn(),
        } as unknown as jest.Mocked<SyncRepositoryGateway>

        interactor = new SyncInteractor(mockRepository)
    })

    afterEach(() => {
        consoleInfoSpy.mockRestore()
    })

    // =========================================================================
    // MANUALLY SYNCING
    // =========================================================================
    describe('manuallySyncing', () => {
        it('Should strip serverId and status from entity and pass cleaned data to repository', async () => {
            // Arrange
            const incomingEntity = {
                id: 'local-uuid-123',
                name: 'Betoneira Tomada 3 frentes',
                serverId: 'server-uuid-999', // Deve ser removido
                status: 'synced', // Deve ser removido
                enterpriseId: 'ent-888',
            }
            const expectedCleanedData = {
                id: 'local-uuid-123',
                name: 'Betoneira Tomada 3 frentes',
                enterpriseId: 'ent-888',
            }
            const mockRepoResponse = { ...expectedCleanedData, serverId: 'server-uuid-999' }
            mockRepository.manuallySyncing.mockResolvedValueOnce(mockRepoResponse)

            // Act
            const result = await interactor.manuallySyncing(incomingEntity, 'WorkEquipment')

            // Assert
            expect(consoleInfoSpy).toHaveBeenCalledWith(expectedCleanedData)
            expect(mockRepository.manuallySyncing).toHaveBeenCalledWith(expectedCleanedData, 'WorkEquipment')
            expect(result).toEqual(mockRepoResponse)
        })
    })

    // =========================================================================
    // PUSH DATA
    // =========================================================================
    describe('push', () => {
        it('Should directly forward sync data payload to repository gateway', async () => {
            // Arrange
            const mockPushPayload = {
                invoices: { created: [], updated: [], deleted: [] },
            } as unknown as SyncPushRequest

            const mockPushResponse = { success: true } as unknown as SyncPushResponse
            mockRepository.push.mockResolvedValueOnce(mockPushResponse)

            // Act
            const result = await interactor.push(mockPushPayload)

            // Assert
            expect(mockRepository.push).toHaveBeenCalledWith(mockPushPayload)
            expect(result).toEqual(mockPushResponse)
        })
    })

    // =========================================================================
    // PULL DATA
    // =========================================================================
    describe('pull', () => {
        it('Should execute pulling with isFirstSync false when lastPulledAt timestamp is provided', async () => {
            // Arrange
            const lastPulledAt = 1714521600000 // Timestamp válido fornecido
            const mockPullResponse = { changes: {}, timestamp: 1714530000000 } as unknown as SyncPullResponse
            mockRepository.pull.mockResolvedValueOnce(mockPullResponse)

            // Act
            const result = await interactor.pull(
                lastPulledAt,
                'enterprise-123',
                'user-55',
                'roger.freitas',
                'ADMIN'
            )

            // Assert
            expect(mockRepository.pull).toHaveBeenCalledWith(
                lastPulledAt,
                'enterprise-123',
                'user-55',
                'roger.freitas',
                'ADMIN',
                false // isFirstSync deve ser falso
            )
            expect(result).toEqual(mockPullResponse)
        })

        it('Should fallback to 90 days ago and set isFirstSync to true if lastPulledAt is zero or undefined', async () => {
            // Arrange
            const mockCurrentTime = 1714521600000 // Fixando o Date.now() fictício
            const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(mockCurrentTime)

            // 1714521600000 - 7776000000 (90 dias) = 1706745600000
            const expectedComputedTimestamp = mockCurrentTime - 7776000000

            const mockPullResponse = {
                changes: {},
                timestamp: mockCurrentTime,
            } as unknown as SyncPullResponse
            mockRepository.pull.mockResolvedValueOnce(mockPullResponse)

            // Act
            const result = await interactor.pull(
                0, // Simulando falta de registro local (primeira sincronização)
                'enterprise-123',
                'user-55',
                'roger.freitas',
                'ADMIN'
            )

            // Assert
            expect(mockRepository.pull).toHaveBeenCalledWith(
                expectedComputedTimestamp,
                'enterprise-123',
                'user-55',
                'roger.freitas',
                'ADMIN',
                true // isFirstSync deve ser verdadeiro
            )
            expect(result).toEqual(mockPullResponse)

            dateSpy.mockRestore() // Restaura comportamento original do Date
        })
    })
})
