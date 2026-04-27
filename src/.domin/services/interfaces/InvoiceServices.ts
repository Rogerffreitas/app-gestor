import Token from '../../../interfaces/Token'
import { InvoiceDto } from '../../entity/invoice/InvoiceDto'

export interface InvoiceServices {
    /**
     * Buscar itens para compor a fatura
     *
     * @param {string} transportVehicleOrWorkEquipmentId - Id.
     * @param {string} baseURL - Url base.
     * @param {string} url - Url api.
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {number} startDate - Data de inicio.
     * @param {number} endDate - Data de Fim.
     * @param {string} type - Tipo: Equipamento ou Vehicle
     * @param {Token} token - Token api
     * @returns {InvoiceDto} Resultado.
     */
    loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
        transportVehicleOrWorkEquipmentId: string,
        baseURL: string,
        url: string,
        enterpriseId: string,
        workId: string,
        startDate: number,
        endDate: number,
        type: string,
        token: Token
    ): Promise<InvoiceDto>

    /**
     * Salva a fatura no banco de dados e atualiza os status
     *
     * @param {string} baseURL - Url base.
     * @param {string} url - Url api.
     * @param {InvoiceDto} Invoice - Fatura
     * @param {Token} token - Token api
     * @returns {InvoiceDto} Resultado.
     */
    generateInvoice(baseURL: string, url: string, Invoice: InvoiceDto, token: Token): Promise<InvoiceDto>

    loadAllInoviceEnterpriseIdAndWorkIdAndType(
        baseURL: string,
        url: string,
        enterpriseId: string,
        workId: string,
        type: string,
        token: Token
    ): Promise<InvoiceDto[]>

    /**
     * Buscar um fatura por id
     *
     * @param {string} baseURL - Url base.
     * @param {string} url - Url api.
     * @param {string} id - Fatura
     * @param {string} enterpriseId - empresa
     * @param {string} workId - obra
     * @param {Token} token - Token api
     * @returns {InvoiceDto} Resultado.
     */
    loadAInoviceById(
        baseURL: string,
        url: string,
        id: string,
        enterpriseId: string,
        workId: string,
        token: Token
    ): Promise<InvoiceDto>

    /**
     * Atualiza a fatura no banco de dados e atualiza os status
     *
     * @param {string} baseURL - Url base.
     * @param {string} url - Url api.
     * @param {InvoiceDto} Invoice - Fatura
     * @param {Token} token - Token api
     * @returns {InvoiceDto} Resultado.
     */
    updateInvoice(baseURL: string, url: string, Invoice: InvoiceDto, token: Token): Promise<InvoiceDto>

    /**
     * Imprimir fatura
     *
     * @param {string} baseURL - Url base.
     * @param {string} url - Url api.
     * @param {Token} token - Token api
     * @param {string} invoiceId - id da fatura
     * @param {string} enterpriseId - id da empresa
     * @param {string} workId - id da obra
     * @returns {string} Resultado.
     */
    generateInvoiceAnalyticPdfFormat(
        baseURL: string,
        url: string,
        token: Token,
        invoiceId: string,
        enterpriseId: string,
        workId: string
    ): Promise<string>
}
