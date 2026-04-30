import DepositDto from '../deposit/DepositDto'
import DepositEntity from '../deposit/DepositEntity'

describe('DepositEntity', () => {
    let depositEntity: DepositEntity
    let mockChangeErrorFields: jest.Mock
    let mockSetErrorMessage: jest.Mock

    beforeEach(() => {
        depositEntity = new DepositEntity().dtoToEntity({ name: 'teste', description: 'teste' } as DepositDto)

        // Mock para lidar com a chamada curried: changeErrorFields('campo')('mensagem')
        mockSetErrorMessage = jest.fn()
        mockChangeErrorFields = jest.fn().mockReturnValue(mockSetErrorMessage)
    })

    describe('Conversores de Dados', () => {
        it('deve mapear corretamente um DTO para a Entidade', () => {
            const dtoData = {
                name: 'Depósito Central',
                description: 'Armazém principal',
                serverId: 'srv-1',
                id: '123',
                userId: 'user-01',
                userAction: 'create',
                enterpriseId: 'ent-99',
                isValid: true,
            }

            depositEntity.dtoToEntity(dtoData as any)

            expect(depositEntity.name).toBe(dtoData.name)
            expect(depositEntity.description).toBe(dtoData.description)
            expect((depositEntity as any).serverId).toBe(dtoData.serverId)
        })

        it('deve retornar a própria instância se o model vier vazio em modelToEntity', () => {
            const result = depositEntity.modelToEntity(null as any)
            expect(result).toBe(depositEntity)
        })
    })

    describe('Validações (validate)', () => {
        it('deve passar sem erros se os dados forem válidos', () => {
            const validData = {
                name: 'Estoque A',
                description: 'Descrição válida',
            }

            depositEntity.dtoToEntity(validData as any)

            expect(() => depositEntity.validate!(mockChangeErrorFields)).not.toThrow()
        })

        it('deve lançar erro se o nome estiver vazio', () => {
            depositEntity.dtoToEntity({ name: '', description: 'Desc' } as any)

            expect(() => depositEntity.validate!(mockChangeErrorFields)).toThrow(/Entity validation failed/)
            expect(mockChangeErrorFields).toHaveBeenCalledWith('name')
            expect(mockSetErrorMessage).toHaveBeenCalledWith('Preencha o campo obrigatório')
        })

        it('deve lançar erro se o nome exceder 50 caracteres', () => {
            const longName = 'a'.repeat(51)
            depositEntity.dtoToEntity({ name: longName, description: 'Desc' } as any)

            expect(() => depositEntity.validate!(mockChangeErrorFields)).toThrow()
            expect(mockSetErrorMessage).toHaveBeenCalledWith('Max. 50 caracteres')
        })

        it('deve lançar erro se a descrição estiver vazia', () => {
            depositEntity.dtoToEntity({ name: 'Nome Ok', description: ' ' } as any)

            expect(() => depositEntity.validate!(mockChangeErrorFields)).toThrow()
            expect(mockChangeErrorFields).toHaveBeenCalledWith('description')
        })

        it('deve acumular múltiplos erros na mensagem da Exception', () => {
            // Nome longo e descrição vazia
            depositEntity.dtoToEntity({ name: 'a'.repeat(51), description: '' } as any)

            try {
                depositEntity.validate!(mockChangeErrorFields)
            } catch (error: any) {
                expect(error.message).toContain('[frames]: Max. 50 caracteres') // Conforme seu código que usa 'frames' no push
                expect(error.message).toContain('[description]: Preencha o campo obrigatório')
            }
        })
    })
})
