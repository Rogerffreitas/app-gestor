import { InvoiceDto } from '../entity/invoice/InvoiceDto'
import { ChangeErrorFields, InvoiceTypes, SummaryInvoice } from '../types'

export interface InvoiceUseCase {
    /**
     * Buscar itens para compor a fatura
     *
     * @param {string} transportVehicleOrWorkEquipmentId - ID.
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {number} startDate - Data de inicio.
     * @param {number} endDate - Data de Fim.
     * @param {InvoiceTypes} type - Tipo: Equipamento ou Vehicle
     * @returns {InvoiceResponseDto} Resultado.
     */
    loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
        transportVehicleOrWorkEquipmentId: string,
        enterpriseId: string,
        workId: string,
        startDate: number,
        endDate: number,
        type: InvoiceTypes
    ): Promise<InvoiceDto>

    /**
     * Salva a fatura no banco de dados e atualiza os status
     *
     * @param {InvoiceDto} invoice - Fatura
     * @returns {InvoiceDto} Resultado.
     */
    generateInvoice(invoice: InvoiceDto, changeErrorFields: ChangeErrorFields): Promise<InvoiceDto>

    /**
     * Atualiza a fatura no banco de dados e atualiza os status
     *
     * @param {InvoiceDto} invoice - Fatura
     * @returns {InvoiceDto} Resultado.
     */
    update(invoice: InvoiceDto, changeErrorFields: ChangeErrorFields): Promise<InvoiceDto>

    /**
     * Buscar faturas
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {InvoiceTypes} type - Tipo: Equipamento ou Vehicle
     * @returns {InvoiceResponseDto} Resultado.
     */
    loadAllInoviceEnterpriseIdAndWorkIdAndType(
        enterpriseId: string,
        workId: string,
        type: InvoiceTypes
    ): Promise<InvoiceDto[]>

    /**
     * Buscar um fatura por id
     *
     * @param {string} id - Fatura
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @returns {InvoiceDto} Resultado.
     */
    loadInoviceById(id: string, enterpriseId: string, workId: string): Promise<InvoiceDto>

    /**
     * Buscar faturas
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {InvoiceTypes} type - Tipo: Equipamento ou Vehicle
     * @returns {SummaryInvoice[]} Resultado.
     */
    loadAllSummayInoviceEnterpriseIdAndWorkIdAndType(
        enterpriseId: string,
        workId: string,
        type: InvoiceTypes
    ): Promise<SummaryInvoice[]>
}
