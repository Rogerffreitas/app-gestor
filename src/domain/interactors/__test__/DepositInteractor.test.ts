import { DepositRepositoryGateway } from '../../application/gateways/DepositRepositoryGateway'
import DepositEntity from '../../entity/deposit/DepositEntity'
import { ChangeErrorFields } from '../../types'
import { DepositDtoFactory } from '../../utils/factories/DepositDtoFactory'
import { DepositInteractor } from '../DepositInteractor'

jest.mock('../../entity/deposit/DepositDto', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    })),
}))

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('DepositInteractor', () => {
    let interactor: DepositInteractor
    let mockRepository: jest.Mocked<DepositRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock with safe defaults for lists
        mockRepository = {
            deleteDepositInLocalDatabase: jest.fn(),
            updateDepositInLocalDatabase: jest.fn(),
            findDepositByIdInLocalDatabase: jest.fn(),
            createDepositInLocalDatabase: jest.fn(),
            loadAllDepositByEnterpriseIdFromLocalDatabase: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<DepositRepositoryGateway>

        // Callback function mock that captures field errors
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new DepositInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE DEPOSIT
    // =========================================================================
    describe('createDepositInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange: Valid data from the factory
            const dto = DepositDtoFactory.create({ id: 'teste' })
            mockRepository.createDepositInLocalDatabase.mockResolvedValueOnce(
                new DepositEntity().dtoToEntity(dto)
            )

            // 2. Act
            const result = await interactor.createDepositInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert: Ensures the repository was called because the real validation PASSED
            expect(mockRepository.createDepositInLocalDatabase).toHaveBeenCalledWith(
                expect.any(DepositEntity) // Ensures a real Entity instance was passed
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled() // No errors were triggered
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            // Arrange: Force an invalid property based on your entity business rules (e.g., negative value)
            const invalidDto = DepositDtoFactory.create({ description: null })

            // Act & Assert: The real Entity is expected to throw an exception during .validate()
            await expect(
                interactor.createDepositInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow()

            expect(mockRepository.createDepositInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE DEPOSIT
    // =========================================================================
    describe('updateDepositInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = DepositDtoFactory.create({ description: 'Updated Deposit Description' })
            mockRepository.updateDepositInLocalDatabase.mockResolvedValueOnce(
                new DepositEntity().dtoToEntity(validDto)
            )

            const result = await interactor.updateDepositInLocalDatabase(validDto, mockChangeErrorFields)

            expect(mockRepository.updateDepositInLocalDatabase).toHaveBeenCalledWith(
                expect.any(DepositEntity)
            )
            expect(result).toBeDefined()
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // DELETE DEPOSIT
    // =========================================================================
    describe('deleteDepositInLocalDatabase', () => {
        it('Should successfully delete the deposit from the database', async () => {
            mockRepository.deleteDepositInLocalDatabase.mockResolvedValueOnce(null)

            await interactor.deleteDepositInLocalDatabase('dep-777', 'user-123')

            expect(mockRepository.deleteDepositInLocalDatabase).toHaveBeenCalledWith('dep-777', 'user-123')
        })
    })

    // =========================================================================
    // FIND & LIST
    // =========================================================================
    describe('findDepositByIdInLocalDatabase', () => {
        it('Should find the deposit by ID', async () => {
            const dto = DepositDtoFactory.create({ description: 'Updated Deposit Description' })

            mockRepository.findDepositByIdInLocalDatabase.mockResolvedValueOnce(
                new DepositEntity().dtoToEntity(dto)
            )

            const result = await interactor.findDepositByIdInLocalDatabase('deposit-777')

            expect(mockRepository.findDepositByIdInLocalDatabase).toHaveBeenCalledWith('deposit-777')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    describe('loadAllDepositByEnterpriseIdFromLocalDatabase', () => {
        it('Should list the deposits by mapping the array', async () => {
            let list: DepositEntity[] = []
            list.push(
                new DepositEntity().dtoToEntity(
                    DepositDtoFactory.create({ id: '1', enterpriseId: 'ent-123' })
                )
            )
            list.push(
                new DepositEntity().dtoToEntity(
                    DepositDtoFactory.create({ id: '2', enterpriseId: 'ent-123' })
                )
            )

            mockRepository.loadAllDepositByEnterpriseIdFromLocalDatabase.mockResolvedValueOnce(list)

            const result = await interactor.loadAllDepositByEnterpriseIdFromLocalDatabase('ent-123')

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })
})
