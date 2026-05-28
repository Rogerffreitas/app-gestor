import { WorkEquipmentRepositoryGateway } from '../../application/gateways/WorkEquipmentRepositoryGateway'
import { WorkEquipmentEntity } from '../../entity/work-equipment/WorkEquipmentEntity'
import { ChangeErrorFields } from '../../types'
import { WorkEquipmentDtoFactory } from '../../utils/factories/WorkEquipmentDtoFactory'
import { WorkEquipmentInteractor } from '../WorkEquipmentInteractor'

jest.mock('../../entity/work-equipment/WorkEquipmentDto', () => {
    const MockWorkEquipmentDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockWorkEquipmentDto,
        WorkEquipmentDto: MockWorkEquipmentDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('WorkEquipmentInteractor', () => {
    let interactor: WorkEquipmentInteractor
    let mockRepository: jest.Mocked<WorkEquipmentRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays
        mockRepository = {
            createWorkEquipmentInLocalDatabase: jest.fn(),
            deleteWorkEquipmentInLocalDatabase: jest.fn(),
            loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
        } as unknown as jest.Mocked<WorkEquipmentRepositoryGateway>

        const baseMock: any = jest.fn().mockImplementation(() => {})
        baseMock.changeErrorFields = jest.fn().mockImplementation(() => {})

        mockChangeErrorFields = baseMock as unknown as ChangeErrorFields

        mockChangeErrorFields = baseMock as unknown as ChangeErrorFields

        interactor = new WorkEquipmentInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE WORK EQUIPMENT
    // =========================================================================
    describe('createWorkEquipmentInLocalDatabase', () => {
        /*it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            const dto = WorkEquipmentDtoFactory.create({ id: 'eq-123' })
            mockRepository.createWorkEquipmentInLocalDatabase.mockResolvedValueOnce(
                new WorkEquipmentEntity().dtoToEntity(dto)
            )

            const result = await interactor.createWorkEquipmentInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.createWorkEquipmentInLocalDatabase).toHaveBeenCalledWith(
                expect.any(WorkEquipmentEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })*/

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property based on your entity business rules (e.g., empty name or type)
            const invalidDto = WorkEquipmentDtoFactory.create({ equipment: undefined })

            // Act & Assert
            await expect(
                interactor.createWorkEquipmentInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createWorkEquipmentInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // DELETE WORK EQUIPMENT
    // =========================================================================
    describe('deleteWorkEquipmentInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteWorkEquipmentInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteWorkEquipmentInLocalDatabase('eq-777', 'user-555')

            expect(mockRepository.deleteWorkEquipmentInLocalDatabase).toHaveBeenCalledWith(
                'eq-777',
                'user-555'
            )
        })
    })

    // =========================================================================
    // LIST METHODS
    // =========================================================================
    describe('loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase', () => {
        it('Should list work equipments filtered by enterprise and work mapping the array', async () => {
            const list: WorkEquipmentEntity[] = [
                new WorkEquipmentEntity().dtoToEntity(WorkEquipmentDtoFactory.create({ id: 'eq-1' })),
                new WorkEquipmentEntity().dtoToEntity(WorkEquipmentDtoFactory.create({ id: 'eq-2' })),
            ]
            mockRepository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase.mockResolvedValueOnce(list)

            const result = await interactor.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
                'ent-abc',
                'work-xyz'
            )

            expect(mockRepository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase).toHaveBeenCalledWith(
                'ent-abc',
                'work-xyz'
            )
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should list valid server equipments filtered by enterprise and work mapping the array', async () => {
            const list: WorkEquipmentEntity[] = [
                new WorkEquipmentEntity().dtoToEntity(
                    WorkEquipmentDtoFactory.create({ id: 'eq-100', serverId: 50 })
                ),
            ]
            mockRepository.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    'ent-abc',
                    'work-xyz'
                )

            expect(
                mockRepository.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase
            ).toHaveBeenCalledWith('ent-abc', 'work-xyz')
            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
