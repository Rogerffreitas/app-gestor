import { MaintenanceTruckRepositoryGateway } from '../../application/gateways/MaintenanceTruckRepositoryGateway'
import { MaintenanceTruckDto } from '../../entity/maintenance-truck/MaintenanceTruckDto'
import { MaintenanceTruckEntity } from '../../entity/maintenance-truck/MaintenanceTruckEntity'
import { ChangeErrorFields } from '../../types'
import { MaintenanceTruckDtoFactory } from '../../utils/factories/MaintenanceTruckDtoFactory'
import { MaintenanceTruckInteractor } from '../MaintenanceTruckInteractor'

jest.mock('../../entity/maintenance-truck/MaintenanceTruckDto', () => {
    const MockMaintenanceTruckDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockMaintenanceTruckDto,
        MaintenanceTruckDto: MockMaintenanceTruckDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('MaintenanceTruckInteractor', () => {
    let dto: MaintenanceTruckDto
    let interactor: MaintenanceTruckInteractor
    let mockRepository: jest.Mocked<MaintenanceTruckRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for lists
        mockRepository = {
            createMaintenanceTruckInLocalDatabase: jest.fn(),
            deleteMaintenanceTruckInLocalDatabase: jest.fn(),
            findMaintenanceTruckByIdInLocalDatabase: jest.fn().mockResolvedValue(null),
            loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
        } as unknown as jest.Mocked<MaintenanceTruckRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new MaintenanceTruckInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE MAINTENANCE TRUCK
    // =========================================================================
    describe('createMaintenanceTruckInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange
            const dto = MaintenanceTruckDtoFactory.create({ id: 'truck-123' })
            mockRepository.createMaintenanceTruckInLocalDatabase.mockResolvedValueOnce(
                new MaintenanceTruckEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createMaintenanceTruckInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert
            expect(mockRepository.createMaintenanceTruckInLocalDatabase).toHaveBeenCalledWith(
                expect.any(MaintenanceTruckEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property based on your entity business rules
            const invalidDto = MaintenanceTruckDtoFactory.create({ modelOrPlate: null })

            // Act & Assert
            await expect(
                interactor.createMaintenanceTruckInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createMaintenanceTruckInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE MAINTENANCE TRUCK
    // =========================================================================
    describe('updateMaintenanceTruckInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            // NOTE: Mirrors your interactor code which calls repository.createMaintenanceTruckInLocalDatabase inside update
            const validDto = MaintenanceTruckDtoFactory.create({ id: 'truck-123', capacity: 15000 })
            mockRepository.createMaintenanceTruckInLocalDatabase.mockResolvedValueOnce(
                new MaintenanceTruckEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateMaintenanceTruckInLocalDatabase(
                validDto,
                mockChangeErrorFields
            )

            expect(mockRepository.createMaintenanceTruckInLocalDatabase).toHaveBeenCalledWith(
                expect.any(MaintenanceTruckEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE MAINTENANCE TRUCK
    // =========================================================================
    describe('deleteMaintenanceTruckInLocalDatabase', () => {
        it('Should successfully delete the maintenance truck from the database using three identifiers', async () => {
            mockRepository.deleteMaintenanceTruckInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteMaintenanceTruckInLocalDatabase('truck-id', 'eq-id', 'user-id')

            expect(mockRepository.deleteMaintenanceTruckInLocalDatabase).toHaveBeenCalledWith(
                'truck-id',
                'eq-id',
                'user-id'
            )
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('findMaintenanceTruckByIdInLocalDatabase', () => {
        it('Should return mapped DTO when the record is found by ID, enterpriseId and workId', async () => {
            const dto = MaintenanceTruckDtoFactory.create({ id: 'truck-777' })
            mockRepository.findMaintenanceTruckByIdInLocalDatabase.mockResolvedValueOnce(
                new MaintenanceTruckEntity().dtoToEntity(dto)
            )

            const result = await interactor.findMaintenanceTruckByIdInLocalDatabase(
                'truck-777',
                'ent-1',
                'work-1'
            )

            expect(mockRepository.findMaintenanceTruckByIdInLocalDatabase).toHaveBeenCalledWith(
                'truck-777',
                'ent-1',
                'work-1'
            )
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should return null directly when the repository cannot find the record', async () => {
            mockRepository.findMaintenanceTruckByIdInLocalDatabase.mockResolvedValueOnce(null)

            const result = await interactor.findMaintenanceTruckByIdInLocalDatabase(
                'non-existent',
                'ent-1',
                'work-1'
            )

            expect(result).toBeNull()
        })
    })

    describe('loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase', () => {
        it('Should list maintenance trucks filtered by enterprise and work mapping the array', async () => {
            const list: MaintenanceTruckEntity[] = [
                new MaintenanceTruckEntity().dtoToEntity(MaintenanceTruckDtoFactory.create({ id: '1' })),
                new MaintenanceTruckEntity().dtoToEntity(MaintenanceTruckDtoFactory.create({ id: '2' })),
            ]
            mockRepository.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                'ent-1',
                'work-1'
            )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should list valid server trucks filtered by enterprise and work mapping the array', async () => {
            const list: MaintenanceTruckEntity[] = [
                new MaintenanceTruckEntity().dtoToEntity(MaintenanceTruckDtoFactory.create({ id: '10' })),
            ]
            mockRepository.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    'ent-1',
                    'work-1'
                )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
