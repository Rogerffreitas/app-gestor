import { MaterialTransportRepositoryGateway } from '../../application/gateways/MaterialTransportRepositoryGateway'
import { MaterialTransportEntity } from '../../entity/material-transport/MaterialTransportEntity'
import { ChangeErrorFields, Reference } from '../../types'
import { MaterialTransportDtoFactory } from '../../utils/factories/MaterialTransportDtoFactory'
import { MaterialTransportInteractor } from '../MaterialTransportInteractor'

jest.mock('../../entity/material-transport/MaterialTransportDto', () => {
    const MockMaterialTransportDto = jest.fn().mockImplementation(() => ({
        fromDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockMaterialTransportDto,
        MaterialTransportDto: MockMaterialTransportDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('MaterialTransportInteractor', () => {
    let interactor: MaterialTransportInteractor
    let mockRepository: jest.Mocked<MaterialTransportRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays
        mockRepository = {
            createMaterialTransportInLocalDatabase: jest.fn(),
            deleteMaterialTransportInLocalDatabase: jest.fn(),
            loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
        } as unknown as jest.Mocked<MaterialTransportRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new MaterialTransportInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE MATERIAL TRANSPORT
    // =========================================================================
    describe('createMaterialTransportInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange
            const dto = MaterialTransportDtoFactory.create({ id: 'trans-123' })
            mockRepository.createMaterialTransportInLocalDatabase.mockResolvedValueOnce(
                new MaterialTransportEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createMaterialTransportInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert
            expect(mockRepository.createMaterialTransportInLocalDatabase).toHaveBeenCalledWith(
                expect.any(MaterialTransportEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property according to your entity business rules (e.g., negative volume or missing ID)
            const invalidDto = MaterialTransportDtoFactory.create({
                material: undefined,
            })

            // Act & Assert
            await expect(
                interactor.createMaterialTransportInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createMaterialTransportInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // DELETE MATERIAL TRANSPORT
    // =========================================================================
    describe('deleteMaterialTransportInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteMaterialTransportInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteMaterialTransportInLocalDatabase('trans-777', 'user-001')

            expect(mockRepository.deleteMaterialTransportInLocalDatabase).toHaveBeenCalledWith(
                'trans-777',
                'user-001'
            )
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase', () => {
        it('Should list transport records filtered by enterprise, work and vehicle mapping the array', async () => {
            // Arrange
            const list: MaterialTransportEntity[] = [
                new MaterialTransportEntity().dtoToEntity(MaterialTransportDtoFactory.create({ id: '1' })),
                new MaterialTransportEntity().dtoToEntity(MaterialTransportDtoFactory.create({ id: '2' })),
            ]
            mockRepository.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            // Act
            const result =
                await interactor.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
                    'ent-1',
                    'work-5',
                    'vehicle-uuid-123'
                )

            // Assert
            expect(
                mockRepository.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase
            ).toHaveBeenCalledWith('ent-1', 'work-5', 'vehicle-uuid-123')
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })
})
