import { InvoiceRepositoryGateway } from '../application/gateways/InvoiceRepositoryGateway'
import { InvoiceEntity } from '../entity/invoice/InvoiceEntity'
import { ChangeErrorFields, InvoiceStatus, InvoiceTypes, SummaryInvoice, UserAction } from '../types'
import { InvoiceUseCase } from '../use-cases/InvoiceUseCase'
import { InvoiceDto } from '../entity/invoice/InvoiceDto'
import { randomUUID } from 'crypto'

export class InvoiceInteractor implements InvoiceUseCase {
    private repository: InvoiceRepositoryGateway

    constructor(repository: InvoiceRepositoryGateway) {
        this.repository = repository
    }
    async loadAllSummayInoviceEnterpriseIdAndWorkIdAndType(
        enterpriseId: string,
        workId: string,
        type: InvoiceTypes
    ): Promise<SummaryInvoice[]> {
        const result = await this.repository.loadAllInoviceSummaryEnterpriseIdAndWorkIdAndType(
            enterpriseId,
            workId,
            type
        )
        return result
    }

    async update(invoice: InvoiceDto, changeErrorFields: ChangeErrorFields): Promise<InvoiceDto> {
        const entity = new InvoiceEntity().dtoToEntity(invoice)
        entity.validate(changeErrorFields)
        return new InvoiceDto().entityToDto(await this.repository.update(entity))
    }

    async loadInoviceById(id: string, enterpriseId: string, workId: string): Promise<InvoiceDto> {
        return new InvoiceDto().entityToDto(await this.repository.loadInoviceById(id, enterpriseId, workId))
    }

    async loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
        transportVehicleOrWorkEquipmentId: string,
        enterpriseId: string,
        workId: string,
        startDate: number,
        endDate: number,
        type: InvoiceTypes
    ): Promise<InvoiceDto> {
        const dto = new InvoiceDto().entityToDto(
            await this.repository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                transportVehicleOrWorkEquipmentId,
                enterpriseId,
                workId,
                startDate,
                endDate,
                type
            )
        )
        return dto
    }
    async generateInvoice(invoice: InvoiceDto, changeErrorFields: ChangeErrorFields): Promise<InvoiceDto> {
        invoice.id = randomUUID()
        invoice.createdAt = Date.now()
        invoice.updatedAt = Date.now()
        invoice.userAction = UserAction.CREATE
        invoice.isValid = true
        invoice.invoiceStatus = InvoiceStatus.PENDING
        const entity = new InvoiceEntity().dtoToEntity(invoice)
        entity.validate(changeErrorFields)
        return new InvoiceDto().entityToDto(await this.repository.generateInvoice(entity))
    }

    async loadAllInoviceEnterpriseIdAndWorkIdAndType(
        enterpriseId: string,
        workId: string,
        type: InvoiceTypes
    ): Promise<InvoiceDto[]> {
        const result = await this.repository.loadAllInoviceEnterpriseIdAndWorkIdAndType(
            enterpriseId,
            workId,
            type
        )
        return result.map((item) => new InvoiceDto().entityToDto(item))
    }
}
