import { MaterialRepositoryGateway } from '../../application/gateways/MaterialRepositoryGateway'
import MaterialEntity from '../../entity/material/MaterialEntity'
import { ChangeErrorFields } from '../../types'
import { MaterialDtoFactory } from '../../utils/factories/MaterialDtoFactory'
import { MaterialInteractor } from '../MaterialInteractor'

jest.mock('../../entity/material/MaterialDto', () => {
    const MockMaterialDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockMaterialDto,
        MaterialDto: MockMaterialDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('MaterialInteractor', () => {
    let interactor: MaterialInteractor
    let mockRepository: jest.Mocked<MaterialRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays
        mockRepository = {
            createMaterialInLocalDatabase: jest.fn(),
            updateMaterialInLocalDatabase: jest.fn(),
            deleteMaterialInLocalDatabase: jest.fn(),
            findMaterialByIdInLocalDatabase: jest.fn(),
            loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<MaterialRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new MaterialInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE MATERIAL
    // =========================================================================
    describe('createMaterialInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange
            const dto = MaterialDtoFactory.create({ id: 'mat-123' })
            mockRepository.createMaterialInLocalDatabase.mockResolvedValueOnce(
                new MaterialEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createMaterialInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert
            expect(mockRepository.createMaterialInLocalDatabase).toHaveBeenCalledWith(
                expect.any(MaterialEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property according to your entity domain logic (e.g., empty string name)
            const invalidDto = MaterialDtoFactory.create({ name: '' })

            // Act & Assert
            await expect(
                interactor.createMaterialInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createMaterialInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE MATERIAL
    // =========================================================================
    describe('updateMaterialInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = MaterialDtoFactory.create({ name: 'Updated Material Name' })
            mockRepository.updateMaterialInLocalDatabase.mockResolvedValueOnce(
                new MaterialEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateMaterialInLocalDatabase(validDto, mockChangeErrorFields)

            expect(mockRepository.updateMaterialInLocalDatabase).toHaveBeenCalledWith(
                expect.any(MaterialEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE MATERIAL
    // =========================================================================
    describe('deleteMaterialInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteMaterialInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteMaterialInLocalDatabase('mat-777', 'user-001')

            expect(mockRepository.deleteMaterialInLocalDatabase).toHaveBeenCalledWith('mat-777', 'user-001')
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('findMaterialByIdInLocalDatabase', () => {
        it('Should find the material by ID and return its mapped DTO', async () => {
            const dto = MaterialDtoFactory.create({ id: 'mat-999' })
            mockRepository.findMaterialByIdInLocalDatabase.mockResolvedValueOnce(
                new MaterialEntity().dtoToEntity(dto)
            )

            const result = await interactor.findMaterialByIdInLocalDatabase('mat-999')

            expect(mockRepository.findMaterialByIdInLocalDatabase).toHaveBeenCalledWith('mat-999')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase', () => {
        it('Should list records filtered by enterprise and deposit mapping the array', async () => {
            const list: MaterialEntity[] = [
                new MaterialEntity().dtoToEntity(MaterialDtoFactory.create({ id: '1', depositId: 'dep-10' })),
                new MaterialEntity().dtoToEntity(MaterialDtoFactory.create({ id: '2', depositId: 'dep-10' })),
            ]
            mockRepository.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
                'ent-1',
                'dep-10'
            )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should list valid server records filtered by enterprise and deposit mapping the array', async () => {
            const list: MaterialEntity[] = [
                new MaterialEntity().dtoToEntity(MaterialDtoFactory.create({ id: '100' })),
            ]
            mockRepository.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
                'ent-1',
                'dep-10'
            )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
