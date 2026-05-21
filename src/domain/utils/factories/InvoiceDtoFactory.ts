import { InvoiceStatus, InvoiceTypes } from '../../types'
import { InvoiceDto } from '../../entity/invoice/InvoiceDto'

export class InvoiceDtoFactory {
    static create(overrides: Partial<InvoiceDto> = {}): InvoiceDto {
        const dto = new InvoiceDto()
        const defaultData: Partial<InvoiceDto> = {
            id: 'inv-123',
            startDate: Date.now() - 86400000, // Ontem
            endDate: Date.now(), // Hoje
            invoiceType: InvoiceTypes.EQUIPMENT,
            invoiceStatus: InvoiceStatus.PENDING,
            workId: 'work-abc',
            description: 'Fatura de Equipamento Mensal',
            modelOrPlate: 'CAT-320',
            enterpriseId: 'ent-1',
            userId: 'user-1',
            isValid: true,
            bank: 'Nubank',
            beneficiary: 'Roger',
            agency: '0001',
            account: '12345-6',
            pix: 'meu-pix',
            // Dados aninhados obrigatórios para passar na validação
            transportVehicleOrWorkEquipment: { id: 'eq-999' } as any,
            dataList: [{ serverId: 101 }] as any,
            discountsList: [{ serverId: 201 }] as any,
            fuelSupliesList: [{ value: 50 }] as any,
        }
        return Object.assign(dto, defaultData, overrides)
    }
}
