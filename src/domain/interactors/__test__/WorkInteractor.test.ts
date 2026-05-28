import { WorkRepositoryGateway } from '../../application/gateways/WorkRepositoryGateway'
import WorkEntity from '../../entity/work/WorkEntity'
import { ChangeErrorFields, UserRoles } from '../../types'
import { WorkDtoFactory } from '../../utils/factories/WorkDtoFactory'
import { WorkInteractor } from '../WorkInteractor'

// Mock do WorkDto focado no método entityToDto
jest.mock('../../entity/work/WorkDto', () => {
    const MockWorkDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockWorkDto,
        WorkDto: MockWorkDto,
    }
})

describe('WorkInteractor', () => {
    let interactor: WorkInteractor
    let mockRepository: jest.Mocked<WorkRepositoryGateway>
    let mockChangeErrorFields: any

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock do repositório com defaults seguros
        mockRepository = {
            deleteWorkInLocalDatabase: jest.fn(),
            updateWorkInLocalDatabase: jest.fn(),
            findWorkByIdInLocalDatabase: jest.fn(),
            createWorkInLocalDatabase: jest.fn(),
            loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllWorksByEnterpriseIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<WorkRepositoryGateway>

        // 🔥 MOCK OMNI-FUNCIONAL SEGURO COM TIPAGEM COMBINADA (TS APPROVED)
        const baseMock: any = jest.fn().mockImplementation(() => {})
        baseMock.changeErrorFields = jest.fn().mockImplementation(() => {})
        mockChangeErrorFields = baseMock as unknown as ChangeErrorFields

        interactor = new WorkInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE WORK
    // =========================================================================
    describe('createWorkInLocalDatabase', () => {
        it('Should successfully create a work when data is valid', async () => {
            const dto = WorkDtoFactory.create({ id: 'work-123', name: 'Obra Central' })
            mockRepository.createWorkInLocalDatabase.mockResolvedValueOnce(new WorkEntity().dtoToEntity(dto))

            const result = await interactor.createWorkInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.createWorkInLocalDatabase).toHaveBeenCalledWith(expect.any(WorkEntity))
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT save if Entity validation rejects the data', async () => {
            const invalidDto = WorkDtoFactory.create({ name: '' }) // Cenário inválido para sua Entity

            await expect(
                interactor.createWorkInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createWorkInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE WORK
    // =========================================================================
    describe('updateWorkInLocalDatabase', () => {
        it('Should successfully update a work when data is valid', async () => {
            const dto = WorkDtoFactory.create({ id: 'work-123', name: 'Obra Atualizada' })
            mockRepository.updateWorkInLocalDatabase.mockResolvedValueOnce(new WorkEntity().dtoToEntity(dto))

            const result = await interactor.updateWorkInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.updateWorkInLocalDatabase).toHaveBeenCalledWith(expect.any(WorkEntity))
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT update if Entity validation rejects the data', async () => {
            const invalidDto = WorkDtoFactory.create({ name: '' })

            await expect(
                interactor.updateWorkInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.updateWorkInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // FIND BY ID
    // =========================================================================
    describe('findWorkByIdInLocalDatabase', () => {
        it('Should find a work by id and return its DTO mapping', async () => {
            const entity = new WorkEntity().dtoToEntity(WorkDtoFactory.create({ id: 'work-777' }))
            mockRepository.findWorkByIdInLocalDatabase.mockResolvedValueOnce(entity)

            const result = await interactor.findWorkByIdInLocalDatabase('work-777')

            expect(mockRepository.findWorkByIdInLocalDatabase).toHaveBeenCalledWith('work-777')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE WORK
    // =========================================================================
    describe('deleteWorkInLocalDatabase', () => {
        it('Should call repository to delete work and forward the parameters', async () => {
            mockRepository.deleteWorkInLocalDatabase.mockResolvedValueOnce(undefined as any)

            await interactor.deleteWorkInLocalDatabase('work-001', 'user-999')

            expect(mockRepository.deleteWorkInLocalDatabase).toHaveBeenCalledWith('work-001', 'user-999')
        })
    })

    // =========================================================================
    // LOAD WORK LIST (CONDITIONAL LOGIC)
    // =========================================================================
    describe('loadWorkListFromDatabase', () => {
        it('Should fetch ALL works from enterprise if user role IS ADMIN', async () => {
            const list = [
                new WorkEntity().dtoToEntity(WorkDtoFactory.create({ id: 'w-1' })),
                new WorkEntity().dtoToEntity(WorkDtoFactory.create({ id: 'w-2' })),
            ]
            mockRepository.loadAllWorksByEnterpriseIdFromLocalDatabase.mockResolvedValueOnce(list)

            const result = await interactor.loadWorkListFromDatabase('ent-10', 'user-20', UserRoles.ADMIN)

            expect(mockRepository.loadAllWorksByEnterpriseIdFromLocalDatabase).toHaveBeenCalledWith('ent-10')
            expect(mockRepository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase).not.toHaveBeenCalled()
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
        })

        it('Should fetch works filtered by user block if user role IS NOT ADMIN', async () => {
            const list = [new WorkEntity().dtoToEntity(WorkDtoFactory.create({ id: 'w-3' }))]
            mockRepository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase.mockResolvedValueOnce(list)

            const result = await interactor.loadWorkListFromDatabase('ent-10', 'user-20', 'ANY_OTHER_ROLE')

            expect(mockRepository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase).toHaveBeenCalledWith(
                'ent-10',
                'user-20'
            )
            expect(mockRepository.loadAllWorksByEnterpriseIdFromLocalDatabase).not.toHaveBeenCalled()
            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
