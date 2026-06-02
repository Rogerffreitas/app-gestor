import RentInformation from '../../entity/rent-information/RentInformation'

export class RentInformationFactory {
    /**
     * Cria uma instância de RentInformation.
     * Permite sobrescrever qualquer propriedade passando um objeto parcial.
     */
    static create(
        customFields: Partial<{
            hourMeterOrOdometer: number
            startRental: string
            monthlyPayment: number
            valuePerHourKm: number
            valuePerDay: number
        }> = {}
    ): RentInformation {
        return new RentInformation(
            customFields.hourMeterOrOdometer ?? 1500.0,
            customFields.startRental ?? '2026-05-26',
            customFields.monthlyPayment ?? 26000.01,
            customFields.valuePerHourKm ?? 130.01,
            customFields.valuePerDay ?? 866.66
        )
    }
}
