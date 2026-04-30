import EquipmentDto from '../../equipment/EquipmentDto'

export class EquipmentDtoFactory {
    static create(overrides: Partial<EquipmentDto> = {}): EquipmentDto {
        const dto = new EquipmentDto()

        const defaultData: Partial<EquipmentDto> = {
            id: 'eq-123',
            // Dados de Identificação
            modelOrPlate: 'Caterpillar 320',
            isEquipment: true,
            operatorMotorist: 'Operador Padrão',

            // Dados de Aluguel (RentInformation) - Devem ser números para passar na validação
            hourMeterOrOdometer: 100,
            startRental: '2026-04-23',
            monthlyPayment: 5000,
            valuePerHourKm: 50,
            valuePerDay: 300,

            // Dados do Proprietário (Proprietary)
            nameProprietary: 'Locadora de Máquinas LTDA',
            cpfCnpjProprietary: '00.000.000/0001-00',
            telProprietary: '11999999999',

            // Dados Bancários
            bank: 'Nubank',
            beneficiary: 'Locadora LTDA',
            agency: '0001',
            account: '123456-7',
            pix: '00.000.000/0001-00',

            // Metadados
            userId: 'user-1',
            enterpriseId: 'ent-1',
            status: 'active',
            isValid: true,
        }

        return Object.assign(dto, defaultData, overrides)
    }
}
