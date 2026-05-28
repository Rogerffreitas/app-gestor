import { DiscountRepositoryGateway } from '../../application/gateways/DiscountRepositoryGateway'
import DiscountEntity from '../../entity/discount/DiscountEntity'
import { ChangeErrorFields, DiscountTypes } from '../../types'
import { DiscountDtoFactory } from '../../utils/factories/DiscountDtoFactory'
import { DiscountInteractor } from '../DiscountInteractor'

jest.mock('../../entity/discount/DiscountDto', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => ({ ...item, isDto: true })),
        entityToDto: jest.fn().mockImplementation((item) => ({ ...item, isDto: true })),
    })),
}))
// =========================================================================
// 🎯 SUÍTE DE TESTES DO INTERACTOR
// =========================================================================
describe('DiscountInteractor', () => {
    let interactor: DiscountInteractor
    let mockRepository: jest.Mocked<DiscountRepositoryGateway>
    let mockChangeErrorFields: jest.Mocked<ChangeErrorFields>

    beforeEach(() => {
        jest.clearAllMocks()

        // Local database repository mock
        mockRepository = {
            deleteDiscountInLocalDatabase: jest.fn(),
            updateDiscountInLocalDatabase: jest.fn(),
            findDiscountByIdInLocalDatabase: jest.fn(),
            createDiscountInLocalDatabase: jest.fn(),
            loadAllDiscountByEnterpriseIdFromLocalDatabase: jest.fn(),
            loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase: jest.fn(),
        } as unknown as jest.Mocked<DiscountRepositoryGateway>

        // Callback function mock that captures field errors (if your entity uses it)
        mockChangeErrorFields = jest.fn() as unknown as jest.Mocked<ChangeErrorFields>

        interactor = new DiscountInteractor(mockRepository)
    })

    // =========================================================================
    // CREATE DISCOUNT
    // =========================================================================
    describe('createDiscountInLocalDatabase', () => {
        it('Happy Path: Should successfully create when the Factory provides valid data for the Entity', async () => {
            // 1. Arrange: Valid data from the factory
            const dto = DiscountDtoFactory.create()

            // 2. Act
            const result = await interactor.createDiscountInLocalDatabase(dto, mockChangeErrorFields)

            // 3. Assert: Ensures the repository was called because the real validation PASSED
            expect(mockRepository.createDiscountInLocalDatabase).toHaveBeenCalledWith(
                expect.any(DiscountEntity) // Ensures a real Entity instance was passed
            )
            expect(result).toHaveProperty('isDto', true)
            expect(mockChangeErrorFields).not.toHaveBeenCalled() // No errors were triggered
        })

        it('Unhappy Path: Should fail and NOT save to the database if the real Entity validation rejects the data', async () => {
            const invalidDto = DiscountDtoFactory.create({ description: '', value: -50 })

            await expect(
                interactor.createDiscountInLocalDatabase(invalidDto, mockChangeErrorFields)
            ).rejects.toThrow() // The real Entity is expected to throw an exception

            expect(mockRepository.createDiscountInLocalDatabase).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // UPDATE DISCOUNT
    // =========================================================================
    describe('updateDiscountInLocalDatabase', () => {
        it('Should successfully update if the factory data passes real validation', async () => {
            const validDto = DiscountDtoFactory.create({ description: 'Updated Coupon' })

            const result = await interactor.updateDiscountInLocalDatabase(validDto, mockChangeErrorFields)

            expect(mockRepository.updateDiscountInLocalDatabase).toHaveBeenCalledWith(
                expect.any(DiscountEntity)
            )
            expect(result).toBeDefined()
        })
    })

    // =========================================================================
    // FIND & LIST (These methods do not call .validate(), but they are still tested)
    // =========================================================================
    describe('findDiscountByIdInLocalDatabase', () => {
        it('Should find the discount by ID', async () => {
            const result = await interactor.findDiscountByIdInLocalDatabase('discount-777')

            expect(mockRepository.findDiscountByIdInLocalDatabase).toHaveBeenCalledWith('discount-777')
        })
    })

    describe('loadAllDiscountByEnterpriseIdFromLocalDatabase', () => {
        it('Should list the discounts by mapping the array', async () => {
            let list: DiscountEntity[] = []
            list.push(
                new DiscountEntity().dtoToEntity(
                    DiscountDtoFactory.create({
                        id: '1',
                        enterpriseId: 'ent-123',
                        workId: 'w1',
                        discountType: DiscountTypes.EQUIPMENT,
                        transportVehicleOrWorkEquipmentId: 'eq1',
                    })
                )
            )
            list.push(
                new DiscountEntity().dtoToEntity(
                    DiscountDtoFactory.create({
                        id: '2',
                        enterpriseId: 'ent-123',
                        workId: 'w1',
                        discountType: DiscountTypes.EQUIPMENT,
                        transportVehicleOrWorkEquipmentId: 'eq1',
                    })
                )
            )

            mockRepository.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase.mockResolvedValueOnce(list)
            const result = await interactor.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                'ent-123',
                'w1',
                DiscountTypes.EQUIPMENT,
                'eq1'
            )

            expect(result).toHaveLength(2)
        })
    })
})
