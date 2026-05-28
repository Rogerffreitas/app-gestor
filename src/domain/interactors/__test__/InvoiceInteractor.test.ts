import { InvoiceRepositoryGateway } from '../../application/gateways/InvoiceRepositoryGateway'
import { InvoiceEntity } from '../../entity/invoice/InvoiceEntity'
import { ChangeErrorFields, InvoiceStatus, InvoiceTypes, SummaryInvoice, UserAction } from '../../types'
import { InvoiceDtoFactory } from '../../utils/factories/InvoiceDtoFactory'
import { InvoiceInteractor } from '../InvoiceInteractor'

// Mock do randomUUID nativo do Node/Crypto usado no generateInvoice
jest.mock('crypto', () => ({
    randomUUID: () => 'mocked-invoice-uuid-111',
}))

// Mock do InvoiceDto focado no método entityToDto
jest.mock('../../entity/invoice/InvoiceDto', () => {
    const MockInvoiceDto = jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockInvoiceDto,
        InvoiceDto: MockInvoiceDto,
    }
})

describe('InvoiceInteractor', () => {
    let interactor: InvoiceInteractor
    let mockRepository: jest.Mocked<InvoiceRepositoryGateway>
    let mockChangeErrorFields: any

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock do repositório mapeando todas as operações do Gateway
        mockRepository = {
            loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType: jest.fn(),
            update: jest.fn(),
            loadInoviceById: jest.fn(),
            loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType: jest.fn(),
            generateInvoice: jest.fn(),
            loadAllInoviceEnterpriseIdAndWorkIdAndType: jest.fn(),
        } as unknown as jest.Mocked<InvoiceRepositoryGateway>

        // 🔥 MOCK OMNI-FUNCIONAL SEGURO COM TIPAGEM COMBINADA (TS APPROVED)
        const baseMock: any = jest.fn().mockImplementation(() => {})
        baseMock.changeErrorFields = jest.fn().mockImplementation(() => {})
        mockChangeErrorFields = baseMock as unknown as ChangeErrorFields

        interactor = new InvoiceInteractor(mockRepository)
    })

    // =========================================================================
    // LOAD ALL SUMMARY INVOICE
    // =========================================================================
    describe('loadAllSummayInoviceEnterpriseIdAndWorkIdAndType', () => {
        it('Should return summary list directly from repository without mapping to DTO', async () => {
            const mockSummary: SummaryInvoice[] = [{ total: 1500, count: 5 } as unknown as SummaryInvoice]
            mockRepository.loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType.mockResolvedValueOnce(
                mockSummary
            )

            const result = await interactor.loadAllSummayInoviceEnterpriseIdAndWorkIdAndType(
                'ent-123',
                'work-456',
                InvoiceTypes.EQUIPMENT // Substitua pelo valor correto do seu enum
            )

            expect(mockRepository.loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType).toHaveBeenCalledWith(
                'ent-123',
                'work-456',
                InvoiceTypes.EQUIPMENT
            )
            expect(result).toEqual(mockSummary)
        })
    })

    // =========================================================================
    // UPDATE INVOICE
    // =========================================================================
    describe('update', () => {
        it('Should successfully update invoice when validation passes', async () => {
            const dto = InvoiceDtoFactory.create({ id: 'inv-update' })
            mockRepository.update.mockResolvedValueOnce(new InvoiceEntity().dtoToEntity(dto))

            const result = await interactor.update(dto, mockChangeErrorFields)

            expect(mockRepository.update).toHaveBeenCalledWith(expect.any(InvoiceEntity))
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT update if entity validation rejects data', async () => {
            const invalidDto = InvoiceDtoFactory.create({ transportVehicleOrWorkEquipment: null }) // Cenário inválido fictício

            await expect(interactor.update(invalidDto, mockChangeErrorFields)).rejects.toThrow()

            expect(mockRepository.update).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // LOAD INVOICE BY ID
    // =========================================================================
    describe('loadInoviceById', () => {
        it('Should fetch invoice records and map back to DTO', async () => {
            const entity = new InvoiceEntity().dtoToEntity(InvoiceDtoFactory.create({ id: 'inv-007' }))
            mockRepository.loadInoviceById.mockResolvedValueOnce(entity)

            const result = await interactor.loadInoviceById('inv-007', 'ent-1', 'work-2')

            expect(mockRepository.loadInoviceById).toHaveBeenCalledWith('inv-007', 'ent-1', 'work-2')
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // LOAD INVOICE ITEMS BY DATE RANGE
    // =========================================================================
    describe('loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType', () => {
        it('Should fetch invoice items matching arguments and return a DTO', async () => {
            const entity = new InvoiceEntity().dtoToEntity(InvoiceDtoFactory.create({ id: 'items-group' }))
            mockRepository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType.mockResolvedValueOnce(
                entity
            )

            const result = await interactor.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                'vehicle-99',
                'ent-1',
                'work-2',
                1711929600, // Exemplo timestamp start
                1714521600, // Exemplo timestamp end
                InvoiceTypes.EQUIPMENT
            )

            expect(
                mockRepository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType
            ).toHaveBeenCalledWith(
                'vehicle-99',
                'ent-1',
                'work-2',
                1711929600,
                1714521600,
                InvoiceTypes.EQUIPMENT
            )
            expect(result).toHaveProperty('isDto', true)
        })
    })

    // =========================================================================
    // GENERATE INVOICE (MUTATION & ENRICHMENT)
    // =========================================================================
    describe('generateInvoice', () => {
        it('Should enrich DTO with default system properties, validate, and save to repository', async () => {
            const baseDto = InvoiceDtoFactory.create({ id: '', description: 'Abastecimento Frota' })
            mockRepository.generateInvoice.mockResolvedValueOnce(new InvoiceEntity().dtoToEntity(baseDto))

            const result = await interactor.generateInvoice(baseDto, mockChangeErrorFields)

            // Assertions das mutações de regras de negócio feitas pelo Interactor
            expect(baseDto.id).toBe('mocked-invoice-uuid-111')
            expect(baseDto.createdAt).toBeLessThanOrEqual(Date.now())
            expect(baseDto.updatedAt).toBeLessThanOrEqual(Date.now())
            expect(baseDto.userAction).toBe(UserAction.CREATE)
            expect(baseDto.isValid).toBe(true)
            expect(baseDto.invoiceStatus).toBe(InvoiceStatus.PENDING)

            expect(mockRepository.generateInvoice).toHaveBeenCalledWith(expect.any(InvoiceEntity))
            expect(result).toHaveProperty('isDto', true)
        })

        it('Should fail and NOT save to database if generation input triggers validation errors', async () => {
            const invalidDto = InvoiceDtoFactory.create({ description: '' })

            await expect(interactor.generateInvoice(invalidDto, mockChangeErrorFields)).rejects.toThrow()

            expect(mockRepository.generateInvoice).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // LOAD ALL INVOICES BY ENTERPRISE, WORK AND TYPE
    // =========================================================================
    describe('loadAllInoviceEnterpriseIdAndWorkIdAndType', () => {
        it('Should list invoices from repository and map every item into a DTO array', async () => {
            const list = [
                new InvoiceEntity().dtoToEntity(InvoiceDtoFactory.create({ id: 'inv-1' })),
                new InvoiceEntity().dtoToEntity(InvoiceDtoFactory.create({ id: 'inv-2' })),
            ]
            mockRepository.loadAllInoviceEnterpriseIdAndWorkIdAndType.mockResolvedValueOnce(list)

            const result = await interactor.loadAllInoviceEnterpriseIdAndWorkIdAndType(
                'ent-abc',
                'work-xyz',
                InvoiceTypes.EQUIPMENT
            )

            expect(mockRepository.loadAllInoviceEnterpriseIdAndWorkIdAndType).toHaveBeenCalledWith(
                'ent-abc',
                'work-xyz',
                InvoiceTypes.EQUIPMENT
            )
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
            expect(result[1]).toHaveProperty('isDto', true)
        })
    })
})
