import { TransportVehicleRepositoryGateway } from '../../application/gateways/TransportVehicleRepositoryGateway'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import { TransportVehicleEntity } from '../../entity/transport-vehicle/TransportVehicleEntity'
import { ChangeErrorFields } from '../../types'
import { TransportVehicleDtoFactory } from '../../utils/factories/TransportVehicleDtoFactory'
import { TransportVehicleInteractor } from '../TransportVehicleInteractor'

jest.mock('../../entity/transport-vehicle/TransportVehicleDto', () => {
    const MockTransportVehicleDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockTransportVehicleDto,
        TransportVehicleDto: MockTransportVehicleDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('TransportVehicleInteractor', () => {
    let interactor: TransportVehicleInteractor
    let mockRepository: jest.Mocked<TransportVehicleRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays
        mockRepository = {
            updateTransportVehicleBankInformation: jest.fn(),
            createTransportVehicleInLocalDatabase: jest.fn(),
            updateTransportVehicleInLocalDatabase: jest.fn(),
            deleteTransportVehicleInLocalDatabase: jest.fn(),
            findTransportVehicleByIdInLocalDatabase: jest.fn(),
            loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
        } as unknown as jest.Mocked<TransportVehicleRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new TransportVehicleInteractor(mockRepository)
    })

    // =========================================================================
    // UPDATE BANK INFORMATION
    // =========================================================================
    describe('updateTransportVehicleBankInformation', () => {
        it('Happy Path: Should successfully update bank information and return mapped DTO', async () => {
            const mockBankInfo = new BankInformation('teste', 'teste', 'teste', '001', 'teste')
            const dto = TransportVehicleDtoFactory.create({ id: 'veh-123' })
            mockRepository.updateTransportVehicleBankInformation.mockResolvedValueOnce(
                new TransportVehicleEntity().dtoToEntity(dto)
            )

            const result = await interactor.updateTransportVehicleBankInformation('veh-123', mockBankInfo)

            expect(mockRepository.updateTransportVehicleBankInformation).toHaveBeenCalledWith(
                'veh-123',
                mockBankInfo
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // CREATE TRANSPORT VEHICLE
    // =========================================================================
    describe('createTransportVehicleInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            const dto = TransportVehicleDtoFactory.create({ id: 'veh-777' })
            mockRepository.createTransportVehicleInLocalDatabase.mockResolvedValueOnce(
                new TransportVehicleEntity().dtoToEntity(dto)
            )

            const result = await interactor.createTransportVehicleInLocalDatabase(dto, mockChangeErrorFields)

            expect(mockRepository.createTransportVehicleInLocalDatabase).toHaveBeenCalledWith(
                expect.any(TransportVehicleEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property based on your entity business rules (e.g., missing mandatory plate)
            const invalidDto = TransportVehicleDtoFactory.create({ motorist: '' })

            // Act & Assert
            await expect(
                interactor.createTransportVehicleInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createTransportVehicleInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE TRANSPORT VEHICLE
    // =========================================================================
    describe('updateTransportVehicleInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = TransportVehicleDtoFactory.create({ id: 'veh-777', capacity: 30000 })
            mockRepository.updateTransportVehicleInLocalDatabase.mockResolvedValueOnce(
                new TransportVehicleEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateTransportVehicleInLocalDatabase(
                validDto,
                mockChangeErrorFields
            )

            expect(mockRepository.updateTransportVehicleInLocalDatabase).toHaveBeenCalledWith(
                expect.any(TransportVehicleEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE TRANSPORT VEHICLE
    // =========================================================================
    describe('deleteTransportVehicleInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteTransportVehicleInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteTransportVehicleInLocalDatabase('veh-999', 'user-007')

            expect(mockRepository.deleteTransportVehicleInLocalDatabase).toHaveBeenCalledWith(
                'veh-999',
                'user-007'
            )
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('findTransportVehicleByIdInLocalDatabase', () => {
        it('Should find the transport vehicle by ID and return its mapped DTO', async () => {
            const dto = TransportVehicleDtoFactory.create({ id: 'veh-abc' })
            mockRepository.findTransportVehicleByIdInLocalDatabase.mockResolvedValueOnce(
                new TransportVehicleEntity().dtoToEntity(dto)
            )

            const result = await interactor.findTransportVehicleByIdInLocalDatabase('veh-abc')

            expect(mockRepository.findTransportVehicleByIdInLocalDatabase).toHaveBeenCalledWith('veh-abc')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase', () => {
        it('Should list transport vehicles filtered by enterprise and work mapping the array', async () => {
            const list: TransportVehicleEntity[] = [
                new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create({ id: '1' })),
                new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create({ id: '2' })),
            ]
            mockRepository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result = await interactor.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                'ent-1',
                'work-1'
            )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should list valid server records filtered by enterprise and work mapping the array', async () => {
            const list: TransportVehicleEntity[] = [
                new TransportVehicleEntity().dtoToEntity(TransportVehicleDtoFactory.create({ id: '100' })),
            ]
            mockRepository.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    'ent-1',
                    'work-1'
                )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
