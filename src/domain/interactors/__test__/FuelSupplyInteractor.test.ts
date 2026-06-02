import { FuelSupplyRepositoryGateway } from '../../application/gateways/FuelSupplyRepositoryGateway'
import { FuelSupplyEntity } from '../../entity/fuel-supply/FuelSupplyEntity'
import { ChangeErrorFields } from '../../types'
import { FuelSupplyDtoFactory } from '../../utils/factories/FuelSupplyDtoFactory'
import { FuelSupplyInteractor } from '../FuelSupplyInteractor'

jest.mock('../../entity/fuel-supply/FuelSupplyDto', () => {
    const MockFuelSupplyDto = jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockFuelSupplyDto,
        FuelSupplyDto: MockFuelSupplyDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('FuelSupplyInteractor', () => {
    let interactor: FuelSupplyInteractor
    let mockRepository: jest.Mocked<FuelSupplyRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>
    let mockErrorCallback: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults
        mockRepository = {
            createFuelSupplyInLocalDatabase: jest.fn(),
            updateFuelSupplyInLocalDatabase: jest.fn(),
            deleteFuelSupplyInLocalDatabase: jest.fn(),
            loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
            loadById: jest.fn(),
            loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
            loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
            loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase: jest.fn(),
            loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue(50000), // Safe high default balance
        } as unknown as jest.Mocked<FuelSupplyRepositoryGateway>

        // Mocking the curried validation error callback structure: changeErrorFields('field')('msg')
        mockErrorCallback = jest.fn()
        mockChangeErrorFields = jest
            .fn()
            .mockImplementation(() => mockErrorCallback) as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new FuelSupplyInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE FUEL SUPPLY
    // =========================================================================
    describe('createFuelSupplyInLocalDatabase', () => {
        it('Happy Path: Should successfully create fuel supply when balance is valid and factory data is correct', async () => {
            // 1. Arrange
            const dto = FuelSupplyDtoFactory.create({
                maintenanceTrucksWorkEquipmentId: 'truck-1',
                isGasStation: false,
                quantity: 1000, // 1000 < 50000 (default balance)
            })
            mockRepository.createFuelSupplyInLocalDatabase.mockResolvedValueOnce(
                new FuelSupplyEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createFuelSupplyInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert
            expect(mockRepository.createFuelSupplyInLocalDatabase).toHaveBeenCalledWith(
                expect.any(FuelSupplyEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and throw an error if the quantity exceeds the current tank balance', async () => {
            // Arrange
            const dto = FuelSupplyDtoFactory.create({
                enterpriseId: 'ent-1',
                workId: 'w-1',
                maintenanceTrucksWorkEquipmentId: 'truck-1',
                isGasStation: false,
                quantity: 5000, // 5000 > 2000 (mocked balance)
            })
            mockRepository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase.mockResolvedValueOnce(
                2000
            )

            // Act & Assert
            await expect(
                interactor.createFuelSupplyInLocalDatabase(dto, mockChangeErrorFields)
            ).rejects.toThrow(/Quantidade informada/)

            expect(mockChangeErrorFields).toHaveBeenCalledWith('quantity')
            expect(mockErrorCallback).toHaveBeenCalledWith('Quantidade Inválida')
            expect(mockRepository.createFuelSupplyInLocalDatabase).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail if balance validation passes but real Entity validation fails', async () => {
            // Arrange: Valid balance, but invalid entity field (e.g. missing description or required code)
            const invalidDto = FuelSupplyDtoFactory.create({ description: null })

            // Act & Assert
            await expect(
                interactor.createFuelSupplyInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createFuelSupplyInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE FUEL SUPPLY
    // =========================================================================
    describe('updateFuelSupplyInLocalDatabase', () => {
        it('Should successfully update if balance and data validation both pass', async () => {
            const dto = FuelSupplyDtoFactory.create({ quantity: 500 })
            mockRepository.updateFuelSupplyInLocalDatabase.mockResolvedValueOnce(
                new FuelSupplyEntity().dtoToEntity(dto)
            )

            const result = await interactor.updateFuelSupplyInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.updateFuelSupplyInLocalDatabase).toHaveBeenCalledWith(
                expect.any(FuelSupplyEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE FUEL SUPPLY
    // =========================================================================
    describe('deleteFuelSupplyInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteFuelSupplyInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteFuelSupplyInLocalDatabase('supply-123', 'user-999')

            expect(mockRepository.deleteFuelSupplyInLocalDatabase).toHaveBeenCalledWith(
                'supply-123',
                'user-999'
            )
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('loadById', () => {
        it('Should load a single fuel supply record by ID and return its DTO mapped', async () => {
            const dto = FuelSupplyDtoFactory.create({ id: 'supply-777' })
            mockRepository.loadById.mockResolvedValueOnce(new FuelSupplyEntity().dtoToEntity(dto))

            const result = await interactor.loadById('supply-777')

            expect(mockRepository.loadById).toHaveBeenCalledWith('supply-777')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase', () => {
        it('Should list and map fuel supply records filtered by vehicle ID and type', async () => {
            const list: FuelSupplyEntity[] = [
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create({ id: '1' })),
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create({ id: '2' })),
            ]
            mockRepository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    'ent-1',
                    'work-1',
                    'veh-1',
                    'DIESEL'
                )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase', () => {
        it('Should list and map fuel supply records filtered by maintenance truck ID and type', async () => {
            const list: FuelSupplyEntity[] = [
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create({ id: '10' })),
            ]
            mockRepository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    'ent-1',
                    'work-1',
                    'truck-1',
                    'GASOLINE'
                )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        it('Should list and map all fuel supply records filtered by maintenance truck ID', async () => {
            const list: FuelSupplyEntity[] = [
                new FuelSupplyEntity().dtoToEntity(FuelSupplyDtoFactory.create({ id: '20' })),
            ]
            mockRepository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    'ent-1',
                    'work-1',
                    'truck-1'
                )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })

    describe('loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        it('Should load the last supply record mapped to DTO', async () => {
            const dto = FuelSupplyDtoFactory.create({ id: 'last-supply' })
            mockRepository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase.mockResolvedValueOnce(
                new FuelSupplyEntity().dtoToEntity(dto)
            )

            const result =
                await interactor.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    'ent-1',
                    'work-1',
                    'truck-1'
                )

            expect(
                mockRepository.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase
            ).toHaveBeenCalledWith('ent-1', 'work-1', 'truck-1')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase', () => {
        it('Should return the correct numeric current balance from the gateway', async () => {
            mockRepository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase.mockResolvedValueOnce(
                3500
            )

            const result =
                await interactor.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    'ent-1',
                    'work-1',
                    'truck-1'
                )

            expect(result).toBe(3500)
        })
    })
})
