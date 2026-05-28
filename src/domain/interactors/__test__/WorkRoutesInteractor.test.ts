import { WorkRoutesRepositoryGateway } from '../../application/gateways/WorkRoutesRepositoryGateway'
import WorkRoutesEntity from '../../entity/work-routes/WorkRoutesEntity'
import { ChangeErrorFields } from '../../types'
import { WorkRoutesDtoFactory } from '../../utils/factories/WorkRoutesDtoFactory'
import { WorkRoutesInteractor } from '../WorkRoutesInteractor'

jest.mock('../../entity/work-routes/WorkRoutesDto', () => {
    const MockWorkRoutesDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockWorkRoutesDto,
        WorkRoutesDto: MockWorkRoutesDto,
    }
})

describe('WorkRoutesInteractor', () => {
    let interactor: WorkRoutesInteractor
    let mockRepository: jest.Mocked<WorkRoutesRepositoryGateway>
    let mockChangeErrorFields: any

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock do repositório local com as assinaturas exatas consumidas pela classe
        mockRepository = {
            deleteWorkRoutesInLocalDatabase: jest.fn(),
            updateWorkRoutesInLocalDatabase: jest.fn(),
            findWorkRoutesByIdInLocalDatabase: jest.fn(),
            createWorkRoutesInLocalDatabase: jest.fn(),
            loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<WorkRoutesRepositoryGateway>

        // 🔥 MOCK OMNI-FUNCIONAL SEGURO COM TIPAGEM COMBINADA (TS APPROVED)
        const baseMock: any = jest.fn().mockImplementation(() => {})
        baseMock.changeErrorFields = jest.fn().mockImplementation(() => {})
        mockChangeErrorFields = baseMock as unknown as ChangeErrorFields

        interactor = new WorkRoutesInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE WORK ROUTE
    // =========================================================================
    describe('createWorkRoutesInLocalDatabase', () => {
        it('Should successfully create a work route when data is valid', async () => {
            const dto = WorkRoutesDtoFactory.create({ id: 'route-123', departureLocation: 'Rota Norte' })
            mockRepository.createWorkRoutesInLocalDatabase.mockResolvedValueOnce(
                new WorkRoutesEntity().dtoToEntity(dto)
            )

            const result = await interactor.createWorkRoutesInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.createWorkRoutesInLocalDatabase).toHaveBeenCalledWith(
                expect.any(WorkRoutesEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT save if Entity validation rejects the data', async () => {
            const invalidDto = WorkRoutesDtoFactory.create({ departureLocation: '' }) // Cenário inválido para sua Entity

            await expect(
                interactor.createWorkRoutesInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createWorkRoutesInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE WORK ROUTE
    // =========================================================================
    describe('updateWorkRoutesInLocalDatabase', () => {
        it('Should successfully update a work route when data is valid', async () => {
            const dto = WorkRoutesDtoFactory.create({ id: 'route-123', departureLocation: 'Rota Alterada' })
            mockRepository.updateWorkRoutesInLocalDatabase.mockResolvedValueOnce(
                new WorkRoutesEntity().dtoToEntity(dto)
            )

            const result = await interactor.updateWorkRoutesInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.updateWorkRoutesInLocalDatabase).toHaveBeenCalledWith(
                expect.any(WorkRoutesEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT update if Entity validation rejects the data', async () => {
            const invalidDto = WorkRoutesDtoFactory.create({ departureLocation: '' })

            await expect(
                interactor.updateWorkRoutesInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.updateWorkRoutesInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // FIND BY ID
    // =========================================================================
    describe('findWorkRoutesByIdInLocalDatabase', () => {
        it('Should find a work route by id and return its mapped DTO', async () => {
            const entity = new WorkRoutesEntity().dtoToEntity(
                WorkRoutesDtoFactory.create({ id: 'route-777' })
            )
            mockRepository.findWorkRoutesByIdInLocalDatabase.mockResolvedValueOnce(entity)

            const result = await interactor.findWorkRoutesByIdInLocalDatabase('route-777')

            expect(mockRepository.findWorkRoutesByIdInLocalDatabase).toHaveBeenCalledWith('route-777')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE WORK ROUTE
    // =========================================================================
    describe('deleteWorkRoutesInLocalDatabase', () => {
        it('Should call repository to delete work route and pass correct parameters', async () => {
            mockRepository.deleteWorkRoutesInLocalDatabase.mockResolvedValueOnce(undefined as any)

            await interactor.deleteWorkRoutesInLocalDatabase('route-001', 'user-999')

            expect(mockRepository.deleteWorkRoutesInLocalDatabase).toHaveBeenCalledWith(
                'route-001',
                'user-999'
            )
        })
    })

    // =========================================================================
    // LIST METHODS
    // =========================================================================
    describe('loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase', () => {
        it('Should list work routes by enterprise and work, mapping the resulting array', async () => {
            const list = [
                new WorkRoutesEntity().dtoToEntity(WorkRoutesDtoFactory.create({ id: 'r-1' })),
                new WorkRoutesEntity().dtoToEntity(WorkRoutesDtoFactory.create({ id: 'r-2' })),
            ]
            mockRepository.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                'ent-1',
                'work-A'
            )

            expect(
                mockRepository.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase
            ).toHaveBeenCalledWith('ent-1', 'work-A')
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllWorkRoutesByEnterpriseIdAndServeridValidFromLocalDatabase', () => {
        it('Should list valid server work routes mapping the array to DTOs', async () => {
            const list = [
                new WorkRoutesEntity().dtoToEntity(
                    WorkRoutesDtoFactory.create({ id: 'r-100', serverId: 45 })
                ),
            ]
            mockRepository.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllWorkRoutesByEnterpriseIdAndServeridValidFromLocalDatabase(
                'ent-1',
                'work-A'
            )

            expect(
                mockRepository.loadAllWorkRoutesByEnterpriseIdAndServerIdValidFromLocalDatabase
            ).toHaveBeenCalledWith('ent-1', 'work-A')
            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
