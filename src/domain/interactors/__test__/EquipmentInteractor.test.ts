import { EquipmentRepositoryGateway } from '../../application/gateways/EquipmentRepositoryGateway'
import { BankInformation } from '../../entity/bank-information/BankInformation'
import { EquipmentEntity } from '../../entity/equipment/EquipmentEntity'
import { ChangeErrorFields } from '../../types'
import { EquipmentDtoFactory } from '../../utils/factories/EquipmentDtoFactory'
import { EquipmentInteractor } from '../EquipmentInteractor'

jest.mock('../../entity/equipment/EquipmentDto', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    })),
}))

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('EquipmentInteractor', () => {
    let interactor: EquipmentInteractor
    let mockRepository: jest.Mocked<EquipmentRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays/lists
        mockRepository = {
            updateHourMeterOrOdometerInLocalDatabase: jest.fn(),
            loadAllEquipmentByEnterpriseIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
            createEquipmentInLocalDatabase: jest.fn(),
            updateEquipmentInLocalDatabase: jest.fn(),
            updateEquipmentBankInformation: jest.fn(),
            deleteEquipmentInLocalDatabase: jest.fn(),
            findEquipmentByIdInLocalDatabase: jest.fn(),
            loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<EquipmentRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new EquipmentInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE EQUIPMENT
    // =========================================================================
    describe('createEquipmentInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange
            const dto = EquipmentDtoFactory.create({ id: 'eq-123' })
            mockRepository.createEquipmentInLocalDatabase.mockResolvedValueOnce(
                new EquipmentEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createEquipmentInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert
            expect(mockRepository.createEquipmentInLocalDatabase).toHaveBeenCalledWith(
                expect.any(EquipmentEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force invalid data according to your business rules
            const invalidDto = EquipmentDtoFactory.create({ modelOrPlate: null })

            // Act & Assert
            await expect(
                interactor.createEquipmentInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createEquipmentInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE EQUIPMENT
    // =========================================================================
    describe('updateEquipmentInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = EquipmentDtoFactory.create({ modelOrPlate: 'Updated' })
            mockRepository.updateEquipmentInLocalDatabase.mockResolvedValueOnce(
                new EquipmentEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateEquipmentInLocalDatabase(validDto, mockChangeErrorFields)

            expect(mockRepository.updateEquipmentInLocalDatabase).toHaveBeenCalledWith(
                expect.any(EquipmentEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // UPDATE HOUR METER / ODOMETER
    // =========================================================================
    describe('updateHourMeterOrOdometerInLocalDatabase', () => {
        it('Should successfully update counters if the factory data passes real validation', async () => {
            const validDto = EquipmentDtoFactory.create({ hourMeterOrOdometer: 150 })
            mockRepository.updateHourMeterOrOdometerInLocalDatabase.mockResolvedValueOnce(
                new EquipmentEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateHourMeterOrOdometerInLocalDatabase(
                validDto,
                mockChangeErrorFields
            )

            expect(mockRepository.updateHourMeterOrOdometerInLocalDatabase).toHaveBeenCalledWith(
                expect.any(EquipmentEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // UPDATE BANK INFORMATION
    // =========================================================================
    describe('updateEquipmentBankInformation', () => {
        it('Should successfully update bank details without calling internal entity validation', async () => {
            const dto = EquipmentDtoFactory.create({ id: 'eq-777' })
            const mockBankInfo: BankInformation = { account: '123-x', agency: '001' } as any

            mockRepository.updateEquipmentBankInformation.mockResolvedValueOnce(
                new EquipmentEntity().dtoToEntity(dto)
            )

            const result = await interactor.updateEquipmentBankInformation('eq-777', mockBankInfo)

            expect(mockRepository.updateEquipmentBankInformation).toHaveBeenCalledWith('eq-777', mockBankInfo)
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE EQUIPMENT
    // =========================================================================
    describe('deleteEquipmentInLocalDatabase', () => {
        it('Should successfully delete the equipment from the database', async () => {
            mockRepository.deleteEquipmentInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteEquipmentInLocalDatabase('eq-555', 'user-999')

            expect(mockRepository.deleteEquipmentInLocalDatabase).toHaveBeenCalledWith('eq-555', 'user-999')
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('findEquipmentByIdInLocalDatabase', () => {
        it('Should find the equipment by ID', async () => {
            const dto = EquipmentDtoFactory.create({ id: 'eq-888' })
            mockRepository.findEquipmentByIdInLocalDatabase.mockResolvedValueOnce(
                new EquipmentEntity().dtoToEntity(dto)
            )

            const result = await interactor.findEquipmentByIdInLocalDatabase('eq-888')

            expect(mockRepository.findEquipmentByIdInLocalDatabase).toHaveBeenCalledWith('eq-888')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllEquipmentByEnterpriseIdFromLocalDatabase', () => {
        it('Should list all equipment by enterprise ID mapping the array', async () => {
            const list: EquipmentEntity[] = [
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ id: '1', enterpriseId: 'ent-1' })
                ),
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ id: '2', enterpriseId: 'ent-1' })
                ),
            ]
            mockRepository.loadAllEquipmentByEnterpriseIdFromLocalDatabase.mockResolvedValueOnce(list)

            const result = await interactor.loadAllEquipmentByEnterpriseIdFromLocalDatabase('ent-1')

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase', () => {
        it('Should list valid server equipment by enterprise ID mapping the array', async () => {
            const list: EquipmentEntity[] = [
                new EquipmentEntity().dtoToEntity(
                    EquipmentDtoFactory.create({ id: '10', enterpriseId: 'ent-1' })
                ),
            ]
            mockRepository.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase('ent-1')

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
