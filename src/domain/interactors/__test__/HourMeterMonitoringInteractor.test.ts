import { HourMeterMonitoringRepositoryGateway } from '../../application/gateways/HourMeterMonitoringRepositoryGateway'
import { HourMeterMonitoringEntity } from '../../entity/hour-meter-monitoring/HourMeterMonitoringEntity'
import { ChangeErrorFields } from '../../types'
import { HourMeterMonitoringDtoFactory } from '../../utils/factories/HourMeterMonitoringDtoFactory'
import { HourMeterMonitoringInteractor } from '../HourMeterMonitoringInteractor'

jest.mock('../../entity/hour-meter-monitoring/HourMeterMonitoringDto', () => {
    const MockHourMeterMonitoringDto = jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockHourMeterMonitoringDto,
        HourMeterMonitoringDto: MockHourMeterMonitoringDto,
    }
})

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('HourMeterMonitoringInteractor', () => {
    let interactor: HourMeterMonitoringInteractor
    let mockRepository: jest.Mocked<HourMeterMonitoringRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for arrays
        mockRepository = {
            createHourMeterMonitoringInLocalDatabase: jest.fn(),
            updateHourMeterMonitoringInLocalDatabase: jest.fn(),
            deleteHourMeterMonitoringInLocalDatabase: jest.fn(),
            findHourMeterMonitoringByIdInLocalDatabase: jest.fn(),
            loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
            findLastHourMeterReading: jest.fn(),
            loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([]),
        } as unknown as jest.Mocked<HourMeterMonitoringRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new HourMeterMonitoringInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE HOUR METER MONITORING
    // =========================================================================
    describe('createHourMeterMonitoringInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange
            const dto = HourMeterMonitoringDtoFactory.create({ id: 'hm-123' })
            mockRepository.createHourMeterMonitoringInLocalDatabase.mockResolvedValueOnce(
                new HourMeterMonitoringEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createHourMeterMonitoringInLocalDatabase(
                dto,
                mockChangeErrorFields
            )

            // 3. Assert
            expect(mockRepository.createHourMeterMonitoringInLocalDatabase).toHaveBeenCalledWith(
                expect.any(HourMeterMonitoringEntity)
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property according to your domain logic rules
            const invalidDto = HourMeterMonitoringDtoFactory.create({ currentHourMeterValue: -10 })

            // Act & Assert
            await expect(
                interactor.createHourMeterMonitoringInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createHourMeterMonitoringInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE HOUR METER MONITORING
    // =========================================================================
    describe('updateHourMeterMonitoringInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = HourMeterMonitoringDtoFactory.create({ currentHourMeterValue: 500 })
            mockRepository.updateHourMeterMonitoringInLocalDatabase.mockResolvedValueOnce(
                new HourMeterMonitoringEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateHourMeterMonitoringInLocalDatabase(
                validDto,
                mockChangeErrorFields
            )

            expect(mockRepository.updateHourMeterMonitoringInLocalDatabase).toHaveBeenCalledWith(
                expect.any(HourMeterMonitoringEntity)
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE HOUR METER MONITORING
    // =========================================================================
    describe('deleteHourMeterMonitoringInLocalDatabase', () => {
        it('Should successfully call the repository gateway to delete record', async () => {
            mockRepository.deleteHourMeterMonitoringInLocalDatabase.mockResolvedValueOnce(undefined)

            await interactor.deleteHourMeterMonitoringInLocalDatabase('hm-777', 'user-001')

            expect(mockRepository.deleteHourMeterMonitoringInLocalDatabase).toHaveBeenCalledWith(
                'hm-777',
                'user-001'
            )
        })
    })

    // =========================================================================
    // FIND & LIST METHODS
    // =========================================================================
    describe('findHourMeterMonitoringByIdInLocalDatabase', () => {
        it('Should find the hour meter monitoring record by ID', async () => {
            const dto = HourMeterMonitoringDtoFactory.create({ id: 'hm-999' })
            mockRepository.findHourMeterMonitoringByIdInLocalDatabase.mockResolvedValueOnce(
                new HourMeterMonitoringEntity().dtoToEntity(dto)
            )

            const result = await interactor.findHourMeterMonitoringByIdInLocalDatabase('hm-999')

            expect(mockRepository.findHourMeterMonitoringByIdInLocalDatabase).toHaveBeenCalledWith('hm-999')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase', () => {
        it('Should list records filtered by enterprise, work, and equipment mapping the array', async () => {
            const list: HourMeterMonitoringEntity[] = [
                new HourMeterMonitoringEntity().dtoToEntity(
                    HourMeterMonitoringDtoFactory.create({ id: '1' })
                ),
                new HourMeterMonitoringEntity().dtoToEntity(
                    HourMeterMonitoringDtoFactory.create({ id: '2' })
                ),
            ]
            mockRepository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                    'ent-1',
                    'work-a',
                    'eq-10'
                )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })

    describe('findLastHourMeterReading', () => {
        it('Should find the last hour meter reading and return its mapped DTO', async () => {
            const dto = HourMeterMonitoringDtoFactory.create({ currentHourMeterValue: 1250 })
            mockRepository.findLastHourMeterReading.mockResolvedValueOnce(
                new HourMeterMonitoringEntity().dtoToEntity(dto)
            )

            const result = await interactor.findLastHourMeterReading('ent-1', 'work-a', 'eq-10')

            expect(mockRepository.findLastHourMeterReading).toHaveBeenCalledWith('ent-1', 'work-a', 'eq-10')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase', () => {
        it('Should list records filtered by enterprise, work, and date mapping the array', async () => {
            const list: HourMeterMonitoringEntity[] = [
                new HourMeterMonitoringEntity().dtoToEntity(
                    HourMeterMonitoringDtoFactory.create({ id: '100' })
                ),
            ]
            mockRepository.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase.mockResolvedValueOnce(
                list
            )

            const result =
                await interactor.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                    'ent-1',
                    'work-a',
                    '2026-05-28'
                )

            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('isDto', true)
        })
    })
})
