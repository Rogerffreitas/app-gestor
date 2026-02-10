import { ChangeErrorFields, ErrorMessages } from '../../../types'

export default class RentInformation {
    private _hourMeterOrOdometer: number
    private _startRental: string
    private _monthlyPayment: number
    private _valuePerHourKm: number
    private _valuePerDay: number

    constructor(
        hourMeterOrOdometer: number,
        startRental: string,
        monthlyPayment: number,
        valuePerHourKm: number,
        valuePerDay: number
    ) {
        this._hourMeterOrOdometer = hourMeterOrOdometer
        this._startRental = startRental
        this._monthlyPayment = monthlyPayment
        this._valuePerHourKm = valuePerHourKm
        this._valuePerDay = valuePerDay
    }

    get hourMeterOrOdometer(): number {
        return this._hourMeterOrOdometer
    }
    get startRental(): string {
        return this._startRental
    }
    get monthlyPayment(): number {
        return this._monthlyPayment
    }
    get valuePerHourKm(): number {
        return this._valuePerHourKm
    }
    get valuePerDay(): number {
        return this._valuePerDay
    }

    /**
     * Valida todos os atributos da classe e retorna uma lista de erros formatado.
     * @returns Uma lista (Errors) contendo os erros, ou uma lista vazio se for válido.
     */
    public validate(changeErrorFields: ChangeErrorFields): ErrorMessages[] {
        let errorMessages: ErrorMessages[] = []

        if (this._hourMeterOrOdometer === undefined || this._hourMeterOrOdometer === null) {
            errorMessages.push({
                field: 'hourMeterOrOdometer',
                message: 'O horímetro/hodômetro é obrigatório.',
            })
            changeErrorFields('hourMeterOrOdometer')('Obrigatório')
        }

        if (this._hourMeterOrOdometer <= 0) {
            errorMessages.push({
                field: 'hourMeterOrOdometer',
                message: 'O horímetro/hodômetro não pode ser 0.',
            })
            changeErrorFields('hourMeterOrOdometer')('Obrigatório')
        }

        if (!Number.isInteger(this._hourMeterOrOdometer)) {
            errorMessages.push({ field: 'hourMeterOrOdometer', message: 'Informe um Número Inteiro.' })
            changeErrorFields('hourMeterOrOdometer')('Informe um Número Inteiro.')
        }

        if (this._monthlyPayment === undefined || this._monthlyPayment === null) {
            errorMessages.push({ field: 'monthlyPayment', message: 'O pagamento mensal é obrigatório.' })
            changeErrorFields('monthlyPayment')('Obrigatório')
        }

        if (this._monthlyPayment <= 0) {
            errorMessages.push({ field: 'monthlyPayment', message: 'O pagamento mensal é obrigatório.' })
            changeErrorFields('monthlyPayment')('Obrigatório')
        }

        if (!Number.isInteger(this._monthlyPayment)) {
            errorMessages.push({ field: 'monthlyPayment', message: 'Informe um Número Inteiro.' })
            changeErrorFields('monthlyPayment')('Informe um Número Inteiro.')
        }

        if (this._valuePerHourKm === undefined || this._valuePerHourKm === null) {
            errorMessages.push({ field: 'valuePerHourKm', message: 'O valor por hora/km é obrigatório.' })
            changeErrorFields('valuePerHourKm')('Obrigatório')
        }

        if (this._valuePerHourKm <= 0) {
            errorMessages.push({ field: 'valuePerHourKm', message: 'O valor por hora/km é obrigatório.' })
            changeErrorFields('valuePerHourKm')('Obrigatório')
        }

        if (!Number.isInteger(this._valuePerHourKm)) {
            errorMessages.push({ field: 'valuePerHourKm', message: 'Informe um Número Inteiro.' })
            changeErrorFields('valuePerHourKm')('Informe um Número Inteiro.')
        }

        if (this._valuePerDay === undefined || this._valuePerDay === null) {
            errorMessages.push({ field: 'valuePerDay', message: 'O valor por dia é obrigatório.' })
            changeErrorFields('valuePerDay')('Obrigatório')
        }

        if (this._valuePerDay <= 0) {
            errorMessages.push({ field: 'valuePerDay', message: 'O valor por dia é obrigatório.' })
            changeErrorFields('valuePerDay')('Obrigatório')
        }

        if (!Number.isInteger(this._valuePerDay)) {
            errorMessages.push({ field: 'valuePerDay', message: 'Informe um Número Inteiro.' })
            changeErrorFields('valuePerDay')('Informe um Número Inteiro.')
        }

        return errorMessages
    }
}
