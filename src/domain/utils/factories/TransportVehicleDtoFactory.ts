import TransportVehicleDto from '../../entity/transport-vehicle/TransportVehicleDto'

export class TransportVehicleDtoFactory {
    static create(overrides: Partial<TransportVehicleDto> = {}): TransportVehicleDto {
        const dto = new TransportVehicleDto()

        const defaultData: Partial<TransportVehicleDto> = {
            // Dados do Veículo
            motorist: 'Ricardo Santos',
            plate: 'BRA-5E22',
            color: 'Branco',
            capacity: 15,
            workId: 'work-789',

            // Dados do Proprietário
            nameProprietary: 'TransLog Transportes Ltda',
            cpfCnpjProprietary: '12.345.678/0001-99',
            telProprietary: '(11) 98888-7777',

            // Dados Bancários (Opcionais)
            bank: 'Banco do Brasil',
            beneficiary: 'Ricardo Santos',
            agency: '0123-4',
            account: '12345-6',
            pix: 'ricardo@email.com',

            // Metadados e Controle
            serverId: 808,
            userId: 'user-999',
            enterpriseId: 'ent-888',
            userAction: 1, // UserAction.CREATE
            isValid: true,
            id: 'vehicle-uuid-123',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }

        return Object.assign(dto, defaultData, overrides)
    }

    static createMany(count: number, overrides: Partial<TransportVehicleDto> = {}): TransportVehicleDto[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({
                id: `vehicle-uuid-${i}`,
                plate: `PLT-${2000 + i}`,
                motorist: `Motorista ${i + 1}`,
                ...overrides,
            })
        )
    }
}
