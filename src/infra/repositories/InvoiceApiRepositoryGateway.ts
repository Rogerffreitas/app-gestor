import { InvoiceDto } from '@gestor/domain/entity/invoice/InvoiceDto'
import { InvoiceRequestRepositoryGateway } from '@gestor/domain/application/gateways/InvoiceRequestRepositoryGateway'
import { InvoiceEntity } from '@gestor/domain/entity/invoice/InvoiceEntity'
import { HttpClientGateway } from '@gestor/domain/application/gateways/HttpClientGateway'
import Token from '@gestor/domain/interfaces/Token'

export class InvoiceApiRepositoryGateway implements InvoiceRequestRepositoryGateway {
    constructor(private httpClient: HttpClientGateway) {}

    async previewInvoice(baseURL: string, url: string, entity: InvoiceEntity, token: Token): Promise<string> {
        try {
            const invoice = new InvoiceDto().entityToDto(entity)
            return await this.httpClient.httpRequestPost<string>({
                baseURL: baseURL,
                url: url,
                token: token,
                body: {
                    invoice,
                },
            })
        } catch (error) {
            console.info(error)
            throw new Error(
                `[InvoiceRepository] An unexpected error occurred while trying to create an preview invoice.: ${error}`
            )
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
            const result = await this.httpClient.getRecordsByHttpRequest<string>({
                baseURL: baseURL,
                url: `${url}/${invoiceId}`,
                token: token,
                params: {
                    enterpriseId: enterpriseId,
                    workId: workId,
                },
            })
            return result
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceRepository] An error occurred: ${error}`)
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
            const result = await this.httpClient.getRecordsByHttpRequest<InvoiceDto>({
                baseURL: baseURL,
                url: `${url}/${id}`,
                token: token,
                params: {
                    enterpriseId: enterpriseId,
                    workId: workId,
                },
            })
            return result
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceRepository] An error occurred while retrieving invoice items: ${error}`)
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
            const result = await this.httpClient.getAllRecordsByHttpRequest<InvoiceDto>({
                baseURL: baseURL,
                url: url,
                token: token,
                params: {
                    enterpriseId: enterpriseId,
                    workId: workId,
                    type: type,
                },
            })
            return result
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceRepository] An error occurred while retrieving invoice items: ${error}`)
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
            return await this.httpClient.httpRequestPost<InvoiceDto>({
                baseURL: baseURL,
                url: url,
                token: token,
                body: {
                    transportVehicleOrWorkEquipmentId: transportVehicleOrWorkEquipmentId,
                    enterpriseId: enterpriseId,
                    workId: workId,
                    startDate: startDate,
                    endDate: endDate,
                    type: type,
                },
            })
        } catch (error) {
            console.info(error)
            throw new Error(`[InvoiceRepository] An error occurred while retrieving invoice items: ${error}`)
        }
    }
    async generateInvoice(
        baseURL: string,
        url: string,
        entity: InvoiceEntity,
        token: Token
    ): Promise<InvoiceEntity> {
        try {
            const invoice = new InvoiceDto().entityToDto(entity)
            const result = await this.httpClient.httpRequestPost<InvoiceDto>({
                baseURL: baseURL,
                url: url,
                token: token,
                body: {
                    invoice,
                },
            })
            return new InvoiceEntity().dtoToEntity(result)
        } catch (error) {
            console.info(error)
            throw new Error(
                `[InvoiceRepository] An unexpected error occurred while trying to create an invoice.: ${error}`
            )
        }
    }

    async updateInvoice(
        baseURL: string,
        url: string,
        entity: InvoiceEntity,
        token: Token
    ): Promise<InvoiceEntity> {
        try {
            const invoice = new InvoiceDto().entityToDto(entity)
            const result = await this.httpClient.httpRequesUpdate<InvoiceDto>({
                baseURL: baseURL,
                url: url,
                token: token,
                body: {
                    invoice,
                },
            })
            return new InvoiceEntity().dtoToEntity(result)
        } catch (error) {
            console.info(error)
            throw new Error(
                `[InvoiceRepository] An unexpected error occurred while trying to update an invoice.: ${error}`
            )
        }
    }
}
