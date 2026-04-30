import { InvoiceDto } from '../entity/invoice/InvoiceDto'

export default interface ReportsUseCase {
    generateInvoiceSyntehticPdfFormat(
        enterpriseId: string,
        workId: string,
        type: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer>

    generateInvoiceAnalyticPdfFormat(
        invoiceId: string,
        enterpriseId: string,
        workId: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer>

    generateMaintenanceTruckFuelSuppliesAnalyticPdfFormat(
        startDate: number,
        endDate: number,
        maintenanceTruckId: string,
        enterpriseId: string,
        workId: string,
        returnType: 'base64' | 'Buffer'
    ): Promise<string | Buffer>

    previewInvoice(invoice: InvoiceDto, returnType: 'base64' | 'Buffer'): Promise<string | Buffer>
}
