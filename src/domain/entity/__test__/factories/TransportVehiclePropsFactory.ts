import TransportVehicleProps from '../../../interfaces/props/TransportVehicleProps'
import { UserAction } from '../../../types'

export class TransportVehiclePropsFactory {
    static create(overrides: Partial<TransportVehicleProps> = {}): TransportVehicleProps {
        return {
            id: 'veh-123',
            motorist: 'Ricardo Andrade',
            plate: 'ABC1D23', // Padrão válido
            color: 'Branco',
            capacity: 15,
            workId: 'obra-leste',

            // Proprietary
            nameProprietary: 'Transportes Silva',
            cpfCnpjProprietary: '00.000.000/0001-00',
            telProprietary: '85999998888',

            // Bank
            bank: 'Itaú',
            beneficiary: 'Transportes Silva',
            agency: '0001',
            account: '12345-6',
            pix: 'transp@silva.com',

            // Meta
            serverId: 202,
            userId: 'user-1',
            enterpriseId: 'ent-1',
            userAction: UserAction.CREATE,
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            ...overrides,
        }
    }
}
