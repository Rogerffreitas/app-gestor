import { InvoiceServices } from '../interfaces/InvoiceServices'
import { InvoiceDto } from '../../entity/invoice/InvoiceDto'
import { InvoiceEntity } from '../../entity/invoice/InvoiceEntity'
import Token from '../../interfaces/Token'
import { InvoiceRequestRepositoryGateway } from '../../application/gateways/InvoiceRequestRepositoryGateway'

export class InvoiceServicesImpl implements InvoiceServices {
    constructor(private repository: InvoiceRequestRepositoryGateway) {}

    async previewInvoice(baseURL: string, url: string, Invoice: InvoiceDto, token: Token): Promise<string> {
        try {
            const result = await this.repository.previewInvoice(
                baseURL,
                url,
                new InvoiceEntity().dtoToEntity(Invoice),
                token
            )
            return result
        } catch (error) {
            console.info(`[InvoiceService] ${error}`)
            throw error
        }
    }

    async generateInvoiceAnalyticPdfFormat(
        baseURL: string,
        url: string,
        token: Token,
        invoiceId: string,
        enterpriseId: string,
        workId: string
    ): Promise<string> {
        try {
            return await this.repository.generateInvoiceAnalyticPdfFormat(
                baseURL,
                url,
                token,
                invoiceId,
                enterpriseId,
                workId
            )
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceService] ${error}`)
        }
    }

    async loadAInoviceById(
        baseURL: string,
        url: string,
        id: string,
        enterpriseId: string,
        workId: string,
        token: Token
    ): Promise<InvoiceDto> {
        try {
            const result = await this.repository.loadAInoviceById(
                baseURL,
                url,
                id,
                enterpriseId,
                workId,
                token
            )

            return result
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceService] ${error}`)
        }
    }

    async loadAllInoviceEnterpriseIdAndWorkIdAndType(
        baseURL: string,
        url: string,
        enterpriseId: string,
        workId: string,
        type: string,
        token: Token
    ): Promise<InvoiceDto[]> {
        try {
            const result = await this.repository.loadAllInoviceEnterpriseIdAndWorkIdAndType(
                baseURL,
                url,
                enterpriseId,
                workId,
                type,
                token
            )

            return result
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceService] ${error}`)
        }
    }
    async loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
        transportVehicleOrWorkEquipmentId: string,
        baseURL: string,
        url: string,
        enterpriseId: string,
        workId: string,
        startDate: number,
        endDate: number,
        type: string,
        token: Token
    ): Promise<InvoiceDto> {
        try {
            return await this.repository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                transportVehicleOrWorkEquipmentId,
                baseURL,
                url,
                enterpriseId,
                workId,
                startDate,
                endDate,
                type,
                token
            )
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceService] ${error}`)
        }
    }
    async generateInvoice(
        baseURL: string,
        url: string,
        Invoice: InvoiceDto,
        token: Token
    ): Promise<InvoiceDto> {
        try {
            const result = await this.repository.generateInvoice(
                baseURL,
                url,
                new InvoiceEntity().dtoToEntity(Invoice),
                token
            )
            return new InvoiceDto().entityToDto(result)
        } catch (error) {
            console.info(`[InvoiceService] ${error}`)
            throw error
        }
    }

    async updateInvoice(
        baseURL: string,
        url: string,
        Invoice: InvoiceDto,
        token: Token
    ): Promise<InvoiceDto> {
        try {
            const result = await this.repository.updateInvoice(
                baseURL,
                url,
                new InvoiceEntity().dtoToEntity(Invoice),
                token
            )
            return new InvoiceDto().entityToDto(result)
        } catch (error) {
            console.info(`[InvoiceService] ${error}`)
            throw error
        }
    }
}
