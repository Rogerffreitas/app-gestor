import { EnterpriseRepositoryGateway } from '../../application/gateways/EnterpriseRepositoryGateway'
import { FuelSupplyRepositoryGateway } from '../../application/gateways/FuelSupplyRepositoryGateway'
import { InvoiceRepositoryGateway } from '../../application/gateways/InvoiceRepositoryGateway'
import { MaintenanceTruckRepositoryGateway } from '../../application/gateways/MaintenanceTruckRepositoryGateway'
import { TransportVehicleRepositoryGateway } from '../../application/gateways/TransportVehicleRepositoryGateway'
import { UserRepositoryGateway } from '../../application/gateways/UserRepositoryGateway'
import { WorkEquipmentRepositoryGateway } from '../../application/gateways/WorkEquipmentRepositoryGateway'
import { WorkRepositoryGateway } from '../../application/gateways/WorkRepositoryGateway'
import DocumentDefinitions from '../../application/infra/DocumentDefinitions'
import { PdfGenerator } from '../../application/infra/PdfGenerator'
import { InvoiceDto } from '../../entity/invoice/InvoiceDto'
import { InvoiceEntity } from '../../entity/invoice/InvoiceEntity'
import { InvoiceTypes } from '../../types'
import { InvoiceDtoFactory } from '../../utils/factories/InvoiceDtoFactory'
import { ReportsInteractor } from '../ReportsInteractor'

// Mock do InvoiceEntity para isolar transformações internas do previewInvoice
jest.mock('../../entity/invoice/InvoiceEntity', () => {
    return {
        __esModule: true,
        InvoiceEntity: jest.fn().mockImplementation(() => ({
            dtoToEntity: jest.fn().mockImplementation((dto) => dto),
        })),
    }
})

describe('ReportsInteractor', () => {
    let interactor: ReportsInteractor

    // Mocks dos Serviços Criadores de PDF
    let mockPdfGenerator: jest.Mocked<PdfGenerator>
    let mockDocDefinitions: jest.Mocked<DocumentDefinitions>

    // Mocks de Repositórios
    let mockUserRepo: jest.Mocked<UserRepositoryGateway>
    let mockInvoiceRepo: jest.Mocked<InvoiceRepositoryGateway>
    let mockEnterpriseRepo: jest.Mocked<EnterpriseRepositoryGateway>
    let mockWorkRepo: jest.Mocked<WorkRepositoryGateway>
    let mockMaintenanceTruckRepo: jest.Mocked<MaintenanceTruckRepositoryGateway>
    let mockTransportVehicleRepo: jest.Mocked<TransportVehicleRepositoryGateway>
    let mockWorkEquipmentRepo: jest.Mocked<WorkEquipmentRepositoryGateway>
    let mockFuelSupplyRepo: jest.Mocked<FuelSupplyRepositoryGateway>

    beforeEach(() => {
        jest.clearAllMocks()

        // Inicialização de todos os Mocks de Infraestrutura
        mockPdfGenerator = {
            sendPDFBase64: jest.fn().mockResolvedValue('MOCK_BASE64_STRING'),
            sendPDFBuffer: jest.fn().mockResolvedValue(Buffer.from('MOCK_BUFFER')),
        } as unknown as jest.Mocked<PdfGenerator>

        mockDocDefinitions = {
            docDefinitionSyntheticTransportVehicleInvoice: jest
                .fn()
                .mockReturnValue({ body: {}, footer: {}, style: {} }),
            docDefinitionAnalyticalWorkEquipmentInvoice: jest
                .fn()
                .mockReturnValue({ body: {}, footer: {}, style: {} }),
            docDefinitionAnalyticalTransportVehicleInvoice: jest
                .fn()
                .mockReturnValue({ body: {}, footer: {}, style: {} }),
            docDefinitionMaintenanceTruckFuelSuppliesAnalytic: jest
                .fn()
                .mockReturnValue({ body: {}, footer: {}, style: {} }),
        } as unknown as jest.Mocked<DocumentDefinitions>

        mockUserRepo = {
            loadAllUsersByEnterpriseId: jest.fn().mockResolvedValue([{ id: 'user-1' }]),
        } as unknown as jest.Mocked<UserRepositoryGateway>
        mockInvoiceRepo = {
            loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType: jest.fn().mockResolvedValue([{ id: 'inv-1' }]),
            loadInoviceById: jest.fn(),
        } as unknown as jest.Mocked<InvoiceRepositoryGateway>
        mockEnterpriseRepo = {
            loadEnterpriseByID: jest.fn().mockResolvedValue({ id: 'ent-1', name: 'Empresa Master' }),
        } as unknown as jest.Mocked<EnterpriseRepositoryGateway>
        mockWorkRepo = {
            findWorkByIdInLocalDatabase: jest.fn().mockResolvedValue({ id: 'work-1', name: 'Obra Alfa' }),
        } as unknown as jest.Mocked<WorkRepositoryGateway>
        mockMaintenanceTruckRepo = {
            findMaintenanceTruckByIdInLocalDatabase: jest.fn().mockResolvedValue({ id: 'truck-1' }),
        } as unknown as jest.Mocked<MaintenanceTruckRepositoryGateway>
        mockTransportVehicleRepo = {
            loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([{ id: 'v-1' }]),
        } as unknown as jest.Mocked<TransportVehicleRepositoryGateway>
        mockWorkEquipmentRepo = {
            loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase: jest
                .fn()
                .mockResolvedValue([{ id: 'eq-1' }]),
        } as unknown as jest.Mocked<WorkEquipmentRepositoryGateway>
        mockFuelSupplyRepo = {
            loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndStartDateAndEndDateFromLocalDatabase:
                jest.fn().mockResolvedValue([{ id: 'supply-1' }]),
            loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndPreviousDateFromLocalDatabase:
                jest.fn().mockResolvedValue(500),
        } as unknown as jest.Mocked<FuelSupplyRepositoryGateway>

        interactor = new ReportsInteractor(
            mockPdfGenerator,
            mockInvoiceRepo,
            mockUserRepo,
            mockEnterpriseRepo,
            mockWorkRepo,
            mockMaintenanceTruckRepo,
            mockTransportVehicleRepo,
            mockWorkEquipmentRepo,
            mockFuelSupplyRepo,
            mockDocDefinitions
        )
    })

    // =========================================================================
    // GENERATE INVOICE SYNTHETIC PDF FORMAT
    // =========================================================================
    describe('generateInvoiceSyntehticPdfFormat', () => {
        it('Should successfully generate base64 synthetic invoice for EQUIPMENT type', async () => {
            const result = await interactor.generateInvoiceSyntehticPdfFormat(
                'ent-1',
                'work-1',
                InvoiceTypes.EQUIPMENT,
                'base64'
            )

            expect(mockDocDefinitions.docDefinitionSyntheticTransportVehicleInvoice).toHaveBeenCalled()
            expect(mockPdfGenerator.sendPDFBase64).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object),
                'Resumo de faturas',
                'landscape'
            )
            expect(result).toBe('MOCK_BASE64_STRING')
        })

        it('Should successfully generate Buffer synthetic invoice for TRANSPORT_VEHICLE type', async () => {
            const result = await interactor.generateInvoiceSyntehticPdfFormat(
                'ent-1',
                'work-1',
                InvoiceTypes.TRANSPORT_VEHICLE,
                'Buffer'
            )

            expect(mockDocDefinitions.docDefinitionSyntheticTransportVehicleInvoice).toHaveBeenCalled()
            expect(mockPdfGenerator.sendPDFBuffer).toHaveBeenCalled()
            expect(result).toEqual(Buffer.from('MOCK_BUFFER'))
        })

        it('Should throw wrapper error if type provided is invalid', async () => {
            await expect(
                interactor.generateInvoiceSyntehticPdfFormat('ent-1', 'work-1', 'INVALID_TYPE', 'base64')
            ).rejects.toThrow('[ReportInteractor]: Error: Invalid Invoice Type')
        })

        it('Should fail when validation triggers a missing required data error', async () => {
            mockWorkRepo.findWorkByIdInLocalDatabase.mockResolvedValueOnce(null)

            await expect(
                interactor.generateInvoiceSyntehticPdfFormat(
                    'ent-1',
                    'work-1',
                    InvoiceTypes.EQUIPMENT,
                    'base64'
                )
            ).rejects.toThrow('Required data missing: work')
        })
    })

    // =========================================================================
    // GENERATE INVOICE ANALYTIC PDF FORMAT
    // =========================================================================
    describe('generateInvoiceAnalyticPdfFormat', () => {
        it('Should route correctly to docDefinitionAnalyticalWorkEquipmentInvoice when invoice is an equipment', async () => {
            mockInvoiceRepo.loadInoviceById.mockResolvedValueOnce(
                new InvoiceEntity().dtoToEntity(InvoiceDtoFactory.create())
            )

            const result = await interactor.generateInvoiceAnalyticPdfFormat(
                'inv-123',
                'ent-1',
                'work-1',
                'base64'
            )

            expect(mockDocDefinitions.docDefinitionAnalyticalWorkEquipmentInvoice).toHaveBeenCalled()
            expect(result).toBe('MOCK_BASE64_STRING')
        })

        it('Should route correctly to docDefinitionAnalyticalTransportVehicleInvoice when invoice is a vehicle', async () => {
            mockInvoiceRepo.loadInoviceById.mockResolvedValueOnce(
                new InvoiceEntity().dtoToEntity(
                    InvoiceDtoFactory.create({ invoiceType: InvoiceTypes.TRANSPORT_VEHICLE })
                )
            )

            const result = await interactor.generateInvoiceAnalyticPdfFormat(
                'inv-123',
                'ent-1',
                'work-1',
                'Buffer'
            )

            expect(mockDocDefinitions.docDefinitionAnalyticalTransportVehicleInvoice).toHaveBeenCalled()
            expect(result).toEqual(Buffer.from('MOCK_BUFFER'))
        })

        it('Should fail analytical print if fetched users array is completely empty', async () => {
            mockUserRepo.loadAllUsersByEnterpriseId.mockResolvedValueOnce([]) // Falha na validação de array
            mockInvoiceRepo.loadInoviceById.mockResolvedValueOnce(
                new InvoiceEntity().dtoToEntity(
                    InvoiceDtoFactory.create({ invoiceType: InvoiceTypes.EQUIPMENT })
                )
            )

            await expect(
                interactor.generateInvoiceAnalyticPdfFormat('inv-123', 'ent-1', 'work-1', 'base64')
            ).rejects.toThrow('Required data missing: users')
        })
    })

    // =========================================================================
    // PREVIEW INVOICE
    // =========================================================================
    describe('previewInvoice', () => {
        it('Should render document preview bypassing repository queries for the invoice entity', async () => {
            const givenDto = InvoiceDtoFactory.create({
                enterpriseId: 'ent-1',
                workId: 'work-1',
                invoiceType: InvoiceTypes.TRANSPORT_VEHICLE,
            })

            const result = await interactor.previewInvoice(givenDto, 'base64')

            expect(mockInvoiceRepo.loadInoviceById).not.toHaveBeenCalled()
            expect(mockDocDefinitions.docDefinitionAnalyticalTransportVehicleInvoice).toHaveBeenCalled()
            expect(result).toBe('MOCK_BASE64_STRING')
        })
    })

    // =========================================================================
    // MAINTENANCE TRUCK FUEL SUPPLIES REPORT
    // =========================================================================
    describe('generateMaintenanceTruckFuelSuppliesAnalyticPdfFormat', () => {
        it('Should gather all 8 system data streams successfully and map full operational details into pdf data', async () => {
            const result = await interactor.generateMaintenanceTruckFuelSuppliesAnalyticPdfFormat(
                1711929600,
                1714521600,
                'truck-777',
                'ent-1',
                'work-1',
                'Buffer'
            )

            expect(mockMaintenanceTruckRepo.findMaintenanceTruckByIdInLocalDatabase).toHaveBeenCalledWith(
                'truck-777',
                'ent-1',
                'work-1'
            )
            expect(
                mockFuelSupplyRepo.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndStartDateAndEndDateFromLocalDatabase
            ).toHaveBeenCalled()
            expect(
                mockFuelSupplyRepo.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndPreviousDateFromLocalDatabase
            ).toHaveBeenCalled()
            expect(mockDocDefinitions.docDefinitionMaintenanceTruckFuelSuppliesAnalytic).toHaveBeenCalled()
            expect(result).toEqual(Buffer.from('MOCK_BUFFER'))
        })

        it('Should safely print to console info and bubble custom wrapped error upon any database rejection', async () => {
            const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockFuelSupplyRepo.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndStartDateAndEndDateFromLocalDatabase.mockRejectedValueOnce(
                new Error('Timeout Conexão Local')
            )

            await expect(
                interactor.generateMaintenanceTruckFuelSuppliesAnalyticPdfFormat(
                    1711929600,
                    1714521600,
                    'truck-777',
                    'ent-1',
                    'work-1',
                    'base64'
                )
            ).rejects.toThrow('[ReportInteractor]: Error: Timeout Conexão Local')

            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })
})
