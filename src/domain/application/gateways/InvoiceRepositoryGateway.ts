import { InvoiceEntity } from '../../entity/invoice/InvoiceEntity'
import { InvoiceTypes, SummaryInvoice } from '../../types'

export interface InvoiceRepositoryGateway {
    /**
     * Buscar itens para compor a fatura
     *
     * @param {string} transportVehicleOrWorkEquipmentId - ID.
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {number} startDate - Data de inicio.
     * @param {number} endDate - Data de Fim.
     * @param {InvoiceTypes} type - Tipo: Equipamento ou Vehicle
     * @returns {InvoiceEntity} Resultado.
     */
    loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
        transportVehicleOrWorkEquipmentId: string,
        enterpriseId: string,
        workId: string,
        startDate: number,
        endDate: number,
        type: InvoiceTypes
    ): Promise<InvoiceEntity>

    /**
     * Salva a fatura no banco de dados e atualiza os status
     *
     * @param {InvoiceEntity} invoice - Fatura
     * @returns {InvoiceEntity} Resultado.
     */
    generateInvoice(invoice: InvoiceEntity): Promise<InvoiceEntity>

    /**
     * Atualiza a fatura no banco de dados e atualiza os status
     *
     * @param {InvoiceEntity} invoice - Fatura
     * @returns {InvoiceEntity} Resultado.
     */
    update(invoice: InvoiceEntity): Promise<InvoiceEntity>

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
    ): Promise<InvoiceEntity[]>

    /**
     * Buscar um fatura por id
     *
     * @param {string} id - Fatura
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @returns {InvoiceEntity} Resultado.
     */
    loadInoviceById(id: string, enterpriseId: string, workId: string): Promise<InvoiceEntity>

    /**
     * Buscar faturas
     *
     * @param {string} enterpriseId - Empresa.
     * @param {string} workId - Obra.
     * @param {InvoiceTypes} type - Tipo: Equipamento ou Vehicle
     * @returns {SummaryInvoice} Resultado.
     */
    loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType(
        enterpriseId: string,
        workId: string,
        type: InvoiceTypes
    ): Promise<SummaryInvoice[]>
}
