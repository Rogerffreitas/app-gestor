import { EnterpriseRepositoryGateway } from '../application/gateways/EnterpriseRepositoryGateway'
import { FuelSupplyRepositoryGateway } from '../application/gateways/FuelSupplyRepositoryGateway'
import { InvoiceRepositoryGateway } from '../application/gateways/InvoiceRepositoryGateway'
import { MaintenanceTruckRepositoryGateway } from '../application/gateways/MaintenanceTruckRepositoryGateway'
import { TransportVehicleRepositoryGateway } from '../application/gateways/TransportVehicleRepositoryGateway'
import { UserRepositoryGateway } from '../application/gateways/UserRepositoryGateway'
import { WorkEquipmentRepositoryGateway } from '../application/gateways/WorkEquipmentRepositoryGateway'
import { WorkRepositoryGateway } from '../application/gateways/WorkRepositoryGateway'
import DocumentDefinitions from '../application/infra/DocumentDefinitions'
import { PdfGenerator } from '../application/infra/PdfGenerator'
import { InvoiceDto } from '../entity/invoice/InvoiceDto'
import { InvoiceEntity } from '../entity/invoice/InvoiceEntity'
import { InvoiceTypes } from '../types'
import ReportsUseCase from '../use-cases/ReportsUseCase'

export class ReportsInteractor implements ReportsUseCase {
    private pdfGenerator: PdfGenerator
    private userRepository: UserRepositoryGateway
    private invoiceRepository: InvoiceRepositoryGateway
    private enterpriseRepository: EnterpriseRepositoryGateway
    private workRepository: WorkRepositoryGateway
    private maintenanceTruckRepository: MaintenanceTruckRepositoryGateway
    private transportVehicleRepository: TransportVehicleRepositoryGateway
    private workEquipmentRepository: WorkEquipmentRepositoryGateway
    private fuelSupplyRepository: FuelSupplyRepositoryGateway
    private docDefinitions: DocumentDefinitions

    constructor(
        pdfGenerator: PdfGenerator,
        invoiceRepository: InvoiceRepositoryGateway,
        userRepository: UserRepositoryGateway,
        enterpriseRepository: EnterpriseRepositoryGateway,
        workRepository: WorkRepositoryGateway,
        maintenanceTruckRepository: MaintenanceTruckRepositoryGateway,
        transportVehicleRepository: TransportVehicleRepositoryGateway,
        workEquipmentRepository: WorkEquipmentRepositoryGateway,
        fuelSupplyRepository: FuelSupplyRepositoryGateway,
        docDefinitions: DocumentDefinitions
    ) {
        this.pdfGenerator = pdfGenerator
        this.invoiceRepository = invoiceRepository
        this.userRepository = userRepository
        this.enterpriseRepository = enterpriseRepository
        this.workRepository = workRepository
        this.maintenanceTruckRepository = maintenanceTruckRepository
        this.transportVehicleRepository = transportVehicleRepository
        this.workEquipmentRepository = workEquipmentRepository
        this.fuelSupplyRepository = fuelSupplyRepository
        this.docDefinitions = docDefinitions
    }
    async generateInvoiceSyntehticPdfFormat(
        enterpriseId: string,
        workId: string,
        type: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer> {
        try {
            const [enterprise, work, invoices] = await Promise.all([
                this.enterpriseRepository.loadEnterpriseByID(enterpriseId),
                this.workRepository.findWorkByIdInLocalDatabase(workId),
                this.invoiceRepository.loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType(
                    enterpriseId,
                    workId,
                    type as InvoiceTypes
                ),
            ])

            this.validateRequiredData({ enterprise, work })

            let pdfData

            if (type === InvoiceTypes.EQUIPMENT) {
                pdfData = this.docDefinitions.docDefinitionSyntheticTransportVehicleInvoice(
                    invoices,
                    enterprise!,
                    work!
                )
            } else if (type === InvoiceTypes.TRANSPORT_VEHICLE) {
                pdfData = this.docDefinitions.docDefinitionSyntheticTransportVehicleInvoice(
                    invoices,
                    enterprise!,
                    work!
                )
            } else {
                throw new Error('Invalid Invoice Type')
            }

            const { body, footer, style } = pdfData
            return returnType === 'base64'
                ? await this.pdfGenerator.sendPDFBase64(body, footer, style, 'Resumo de faturas', 'landscape')
                : await this.pdfGenerator.sendPDFBuffer(body, footer, style, 'Resumo de faturas', 'landscape')
        } catch (error) {
            console.info(error)
            throw new Error(`[ReportInteractor]: ${error}`)
        }
    }

    async generateInvoiceAnalyticPdfFormat(
        invoiceId: string,
        enterpriseId: string,
        workId: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer> {
        try {
            const [enterprise, users, work, invoice] = await Promise.all([
                this.enterpriseRepository.loadEnterpriseByID(enterpriseId),
                this.userRepository.loadAllUsersByEnterpriseId(enterpriseId),
                this.workRepository.findWorkByIdInLocalDatabase(workId),
                this.invoiceRepository.loadInoviceById(invoiceId, enterpriseId, workId),
            ])

            this.validateRequiredData({ enterprise, users, work, invoice })

            let pdfData

            if (invoice.invoiceType === InvoiceTypes.EQUIPMENT) {
                pdfData = this.docDefinitions.docDefinitionAnalyticalWorkEquipmentInvoice(
                    invoice,
                    enterprise!,
                    work!,
                    users
                )
            } else if (invoice.invoiceType === InvoiceTypes.TRANSPORT_VEHICLE) {
                pdfData = this.docDefinitions.docDefinitionAnalyticalTransportVehicleInvoice(
                    invoice,
                    enterprise!,
                    work!,
                    users
                )
            } else {
                throw new Error('Invalid Invoice Type')
            }

            const { body, footer, style } = pdfData
            return returnType === 'base64'
                ? await this.pdfGenerator.sendPDFBase64(
                      body,
                      footer,
                      style,
                      'Relatório de faturamento analítico',
                      'landscape'
                  )
                : await this.pdfGenerator.sendPDFBuffer(
                      body,
                      footer,
                      style,
                      'Relatório de faturamento analític0',
                      'landscape'
                  )
        } catch (error) {
            console.info(error)
            throw new Error(`[ReportInteractor]: ${error}`)
        }
    }

    async previewInvoice(invoice: InvoiceDto, returnType: 'base64' | 'Buffer'): Promise<string | Buffer> {
        try {
            const [enterprise, users, work] = await Promise.all([
                this.enterpriseRepository.loadEnterpriseByID(invoice.enterpriseId),
                this.userRepository.loadAllUsersByEnterpriseId(invoice.enterpriseId),
                this.workRepository.findWorkByIdInLocalDatabase(invoice.workId),
            ])

            this.validateRequiredData({ enterprise, users, work, invoice })

            let pdfData

            if (invoice.invoiceType === InvoiceTypes.EQUIPMENT) {
                pdfData = this.docDefinitions.docDefinitionAnalyticalWorkEquipmentInvoice(
                    new InvoiceEntity().dtoToEntity(invoice),
                    enterprise!,
                    work!,
                    users
                )
            } else if (invoice.invoiceType === InvoiceTypes.TRANSPORT_VEHICLE) {
                pdfData = this.docDefinitions.docDefinitionAnalyticalTransportVehicleInvoice(
                    new InvoiceEntity().dtoToEntity(invoice),
                    enterprise!,
                    work!,
                    users
                )
            } else {
                throw new Error('Invalid Invoice Type')
            }

            const { body, footer, style } = pdfData
            return returnType === 'base64'
                ? await this.pdfGenerator.sendPDFBase64(
                      body,
                      footer,
                      style,
                      'Relatório de faturamento analítico',
                      'landscape'
                  )
                : await this.pdfGenerator.sendPDFBuffer(
                      body,
                      footer,
                      style,
                      'Relatório de faturamento analític',
                      'landscape'
                  )
        } catch (error) {
            console.info(error)
            throw new Error(`[ReportInteractor]: ${error}`)
        }
    }

    async generateMaintenanceTruckFuelSuppliesAnalyticPdfFormat(
        startDate: number,
        endDate: number,
        maintenanceTruckId: string,
        enterpriseId: string,
        workId: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer> {
        try {
            const [
                maintenanceTruck,
                fuelSupplies,
                workEquipments,
                transportVehicles,
                enterprise,
                users,
                work,
                previousBalance,
            ] = await Promise.all([
                this.maintenanceTruckRepository.findMaintenanceTruckByIdInLocalDatabase(
                    maintenanceTruckId,
                    enterpriseId,
                    workId
                ),
                this.fuelSupplyRepository.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndStartDateAndEndDateFromLocalDatabase(
                    enterpriseId,
                    workId,
                    maintenanceTruckId,
                    startDate,
                    endDate
                ),
                this.workEquipmentRepository.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
                    enterpriseId,
                    workId
                ),
                this.transportVehicleRepository.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                    enterpriseId,
                    workId
                ),
                this.enterpriseRepository.loadEnterpriseByID(enterpriseId),
                this.userRepository.loadAllUsersByEnterpriseId(enterpriseId),
                this.workRepository.findWorkByIdInLocalDatabase(workId),
                this.fuelSupplyRepository.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndPreviousDateFromLocalDatabase(
                    enterpriseId,
                    workId,
                    maintenanceTruckId,
                    startDate
                ),
            ])
            this.validateRequiredData({ enterprise, users, work, maintenanceTruck })

            const pdfData = this.docDefinitions.docDefinitionMaintenanceTruckFuelSuppliesAnalytic(
                startDate,
                endDate,
                maintenanceTruck!,
                fuelSupplies,
                workEquipments,
                transportVehicles,
                enterprise!,
                work!,
                users,
                previousBalance
            )
            const { body, footer, style } = pdfData
            return returnType === 'base64'
                ? await this.pdfGenerator.sendPDFBase64(
                      body,
                      footer,
                      style,
                      'Relatório de abastecimentos',
                      'landscape'
                  )
                : await this.pdfGenerator.sendPDFBuffer(
                      body,
                      footer,
                      style,
                      'Relatório de abastecimentos',
                      'landscape'
                  )
        } catch (error) {
            console.info(error)
            throw new Error(`[ReportInteractor]: ${error}`)
        }
    }
    private validateRequiredData(data: Record<string, any>) {
        for (const [key, value] of Object.entries(data)) {
            if (!value || (Array.isArray(value) && value.length === 0)) {
                throw new Error(`Required data missing: ${key}`)
            }
        }
    }
}
