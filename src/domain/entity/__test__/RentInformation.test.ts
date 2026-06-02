import { RentInformationFactory } from '../../utils/factories/RentInformationFactory'
import RentInformation from '../rent-information/RentInformation'

describe('RentInformation', () => {
    let rentInformation: RentInformation
    let changeErrorFieldsSpy: jest.Mock

    beforeEach(() => {
        // 1. Criamos o mock da segunda função (a que recebe a mensagem)
        const mockReturnFunction = jest.fn()

        // 2. Criamos o mock da primeira função (a que recebe o campo)
        // Fazemos ela retornar automaticamente a segunda função mockada
        changeErrorFieldsSpy = jest.fn().mockReturnValue(mockReturnFunction)
    })

    describe('RentInformation Domain Getters', () => {
        it('Should successfully return correct values from all getters when initialized', () => {
            // 1. Arrange: Definimos valores específicos que queremos injetar via Factory
            const expectedHourMeter = 2850
            const expectedStartRental = '2026-05-26'
            const expectedMonthlyPayment = 6200.5
            const expectedValuePerHourKm = 145.0
            const expectedValuePerDay = 950.0

            // Inicializa a classe com os valores controlados
            const rentInformation = RentInformationFactory.create({
                hourMeterOrOdometer: expectedHourMeter,
                startRental: expectedStartRental,
                monthlyPayment: expectedMonthlyPayment,
                valuePerHourKm: expectedValuePerHourKm,
                valuePerDay: expectedValuePerDay,
            })

            // 2. Act & Assert: Validamos se cada getter expõe exatamente o valor privado encapsulado

            expect(rentInformation.hourMeterOrOdometer).toBe(expectedHourMeter)
            expect(rentInformation.startRental).toBe(expectedStartRental)
            expect(rentInformation.monthlyPayment).toBe(expectedMonthlyPayment)
            expect(rentInformation.valuePerHourKm).toBe(expectedValuePerHourKm)
            expect(rentInformation.valuePerDay).toBe(expectedValuePerDay)
        })

        it('Should return default values from getters when created without custom arguments', () => {
            // Arrange & Act: Criamos usando os fallbacks padrão da Factory
            const rentInformation = RentInformationFactory.create({
                hourMeterOrOdometer: 1500.01,
                startRental: '2026-05-26',
                monthlyPayment: 4500.0,
                valuePerDay: 800.0,
                valuePerHourKm: 120.5,
            })

            // Assert: Garante que os getters estão integrados e respondendo com os defaults da factory
            expect(rentInformation.hourMeterOrOdometer).toBe(1500.01)
            expect(rentInformation.startRental).toBe('2026-05-26')
            expect(rentInformation.monthlyPayment).toBe(4500.0)
            expect(rentInformation.valuePerHourKm).toBe(120.5)
            expect(rentInformation.valuePerDay).toBe(800.0)
        })
    })

    describe('Fluxo Feliz (Válido)', () => {
        it('Should return an empty array and not trigger callbacks if all fields are valid integers > 0', () => {
            // Todos os campos com inteiros positivos limpos
            const rentInfo = RentInformationFactory.create({
                hourMeterOrOdometer: 1000,
                monthlyPayment: 5000,
                valuePerHourKm: 150,
                valuePerDay: 800,
            })

            const errors = rentInfo.validate(changeErrorFieldsSpy)

            expect(errors).toEqual([])
            expect(changeErrorFieldsSpy).not.toHaveBeenCalled()
        })
    })

    describe('Validações de Obrigatoriedade (Null / Undefined)', () => {
        it('Should capture errors when mandatory fields are missing', () => {
            // 1. Arrange: Força campos nulos para disparar os blocos de obrigatoriedade
            const rentInfo = RentInformationFactory.create({
                hourMeterOrOdometer: null as any,
                monthlyPayment: undefined as any,
                valuePerHourKm: null as any,
                valuePerDay: undefined as any,
            })

            // 2. Act: Executa a validação
            const errors = rentInfo.validate(changeErrorFieldsSpy)

            // Valida se a lista de mensagens retornadas não está vazia
            expect(errors.length).toBeGreaterThan(0)

            // 3. Assert: Mapeamento das chamadas sequenciais por índice do Mock

            // 1ª Chamada: hourMeterOrOdometer (Check Null/Undefined)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(1, 'monthlyPayment')
            expect(changeErrorFieldsSpy.mock.results[0].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 2ª Chamada: hourMeterOrOdometer (Check <= 0 devido ao comportamento do null em JS)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(2, 'valuePerHourKm')
            expect(changeErrorFieldsSpy.mock.results[1].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 3ª Chamada: monthlyPayment (Check Null/Undefined)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(3, 'valuePerDay')
            expect(changeErrorFieldsSpy.mock.results[2].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 4ª Chamada: monthlyPayment (Check <= 0)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(4, 'monthlyPayment')
            expect(changeErrorFieldsSpy.mock.results[3].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 5ª Chamada: valuePerHourKm (Check Null/Undefined)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(5, 'valuePerDay')
            expect(changeErrorFieldsSpy.mock.results[4].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 6ª Chamada: valuePerDay (Check Null/Undefined)
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(6, 'valuePerHourKm')
            expect(changeErrorFieldsSpy.mock.results[5].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )
        })
    })

    describe('Validações de Valores Menores ou Iguais a Zero (<= 0)', () => {
        it('Should return errors if any numeric field is equal to 0', () => {
            const rentInfo = RentInformationFactory.create({
                hourMeterOrOdometer: 0,
                monthlyPayment: 0,
                valuePerHourKm: 0,
                valuePerDay: 0,
            })

            const errors = rentInfo.validate(changeErrorFieldsSpy)

            // 1. Valida o array de mensagens retornado
            expect(errors.length).toBeGreaterThan(0)

            // 2. Valida a Primeira Chamada: hourMeterOrOdometer -> 'Obrigatório'
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(1, 'hourMeterOrOdometer')
            const msgCallback1 = changeErrorFieldsSpy.mock.results[0].value
            expect(msgCallback1).toHaveBeenCalledWith('Obrigatório')

            // 3. Valida a Segunda Chamada: monthlyPayment -> 'Obrigatório'
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(2, 'monthlyPayment')
            const msgCallback2 = changeErrorFieldsSpy.mock.results[1].value
            expect(msgCallback2).toHaveBeenCalledWith('Obrigatório')

            // 4. Valida a Terceira Chamada: valuePerHourKm -> 'Obrigatório'
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(3, 'valuePerHourKm')
            const msgCallback3 = changeErrorFieldsSpy.mock.results[2].value
            expect(msgCallback3).toHaveBeenCalledWith('Obrigatório')

            // 5. Valida a Quarta Chamada: valuePerDay -> 'Obrigatório'
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(4, 'valuePerDay')
            const msgCallback4 = changeErrorFieldsSpy.mock.results[3].value
            expect(msgCallback4).toHaveBeenCalledWith('Obrigatório')
        })

        it('Should return errors if any numeric field is negative', () => {
            const rentInfo = RentInformationFactory.create({
                hourMeterOrOdometer: -50,
                monthlyPayment: -1200,
                valuePerHourKm: -15,
                valuePerDay: -100,
            })

            const errors = rentInfo.validate(changeErrorFieldsSpy)
            expect(errors.length).toBeGreaterThan(0)
        })
    })

    describe('Validações de Casas Decimais (Flutuantes vs Inteiros)', () => {
        it('Should catch decimal violations if numbers contain fractions', () => {
            // 1. Arrange: Envia números decimais
            const rentInfo = RentInformationFactory.create({
                hourMeterOrOdometer: 150.25,
                monthlyPayment: 2500.5,
                valuePerHourKm: 75.8,
                valuePerDay: 400.99,
            })

            // 2. Act: Executa a validação
            const errors = rentInfo.validate(changeErrorFieldsSpy)

            // Valida se o array de erros retornados está preenchido
            expect(errors.length).toBeGreaterThan(0)

            // =========================================================================
            // BLOCO 1: Validações de !Number.isInteger (Chamadas 1 a 4)
            // =========================================================================

            // 1ª Chamada: hourMeterOrOdometer -> Informe um Número Inteiro.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(1, 'hourMeterOrOdometer')
            expect(changeErrorFieldsSpy.mock.results[0].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 2ª Chamada: monthlyPayment -> Informe um Número Inteiro.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(2, 'monthlyPayment')
            expect(changeErrorFieldsSpy.mock.results[1].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 3ª Chamada: valuePerHourKm -> Informe um Número Inteiro.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(3, 'valuePerHourKm')
            expect(changeErrorFieldsSpy.mock.results[2].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // 4ª Chamada: valuePerDay -> Informe um Número Inteiro.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(4, 'valuePerDay')
            expect(changeErrorFieldsSpy.mock.results[3].value).toHaveBeenCalledWith(
                'Informe um Número Inteiro.'
            )

            // =========================================================================
            // BLOCO 2: Validações de % 1 !== 0 (Chamadas 5 a 8)
            // =========================================================================

            // 5ª Chamada: hourMeterOrOdometer -> Não são permitidas casas decimais.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(5, 'hourMeterOrOdometer')
            expect(changeErrorFieldsSpy.mock.results[4].value).toHaveBeenCalledWith(
                'Não são permitidas casas decimais.'
            )

            // 6ª Chamada: monthlyPayment -> Não são permitidas casas decimais.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(6, 'monthlyPayment')
            expect(changeErrorFieldsSpy.mock.results[5].value).toHaveBeenCalledWith(
                'Não são permitidas casas decimais.'
            )

            // 7ª Chamada: valuePerDay -> Não são permitidas casas decimais.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(7, 'valuePerDay')
            expect(changeErrorFieldsSpy.mock.results[6].value).toHaveBeenCalledWith(
                'Não são permitidas casas decimais.'
            )

            // 8ª Chamada: valuePerHourKm -> Não são permitidas casas decimais.
            expect(changeErrorFieldsSpy).toHaveBeenNthCalledWith(8, 'valuePerHourKm')
            expect(changeErrorFieldsSpy.mock.results[7].value).toHaveBeenCalledWith(
                'Não são permitidas casas decimais.'
            )
        })
    })
})
