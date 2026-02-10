import EquipmentModel from '../../../database/model/EquipmentModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { BankInformation } from '../bank-information/BankInformation'
import Proprietary from '../proprietary/Proprietary'
import RentInformation from '../rent-information/RentInformation'
import EquipmentDto from './EquipmentDto'

export class EquipmentEntity extends AbstratcEntity {
    private _operatorMotorist: string
    private _isEquipment: boolean
    private _modelOrPlate: string
    private _rentInformation: RentInformation
    private _proprietary: Proprietary
    private _bankInformation?: BankInformation

    modelToEntity?(data: EquipmentModel): EquipmentEntity {
        this._bankInformation = new BankInformation(
            data.bank,
            data.beneficiary,
            data.agency,
            data.account,
            data.pix
        )
        this._proprietary = new Proprietary(
            data.nameProprietary,
            data.cpfCnpjProprietary,
            data.telProprietary
        )
        this._rentInformation = new RentInformation(
            +data.hourMeterOrOdometer,
            data.startRental,
            +data.monthlyPayment,
            +data.valuePerHourKm,
            +data.valuePerDay
        )
        this._operatorMotorist = data.operatorMotorist
        this._isEquipment = data.isEquipment
        this._modelOrPlate = data.modelOrPlate
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        this.status = data._raw._status
        return this
    }

    dtoToEntity?(data: EquipmentDto): EquipmentEntity {
        this._bankInformation = new BankInformation(
            data.bank,
            data.beneficiary,
            data.agency,
            data.account,
            data.pix
        )
        this._proprietary = new Proprietary(
            data.nameProprietary,
            data.cpfCnpjProprietary,
            data.telProprietary
        )
        this._rentInformation = new RentInformation(
            +data.hourMeterOrOdometer,
            data.startRental,
            +data.monthlyPayment,
            +data.valuePerHourKm,
            +data.valuePerDay
        )
        this._operatorMotorist = data.operatorMotorist
        this._isEquipment = data.isEquipment
        this._modelOrPlate = data.modelOrPlate
        this.serverId = data.serverId
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.id = data.id
        return this
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [Equipment].')
        let errorMessages: ErrorMessages[] = []

        if (!this._operatorMotorist || this._operatorMotorist.trim().length === 0) {
            changeErrorFields('operatorMotorist')('Obrigatório.')
            errorMessages.push({ field: 'operatorMotorist', message: 'O nome do operador é obrigatório.' })
        }

        if (!this._modelOrPlate || this._modelOrPlate.trim().length === 0) {
            changeErrorFields('modelOrPlate')('Obrigatório.')
            errorMessages.push({ field: 'modelOrPlate', message: 'O modelo/placa é obrigatório.' })
        }

        errorMessages.push(...this._proprietary.validate(changeErrorFields))
        errorMessages.push(...this._rentInformation.validate(changeErrorFields))

        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }
        console.log('Entity valid [Equipment].')
    }

    get operatorMotorist(): string {
        return this._operatorMotorist
    }

    get nameProprietary(): string {
        return this._proprietary.name
    }

    get cpfCnpjProprietary(): string {
        return this._proprietary.cpfCnpj
    }

    get telProprietary(): string {
        return this._proprietary.tel
    }

    get isEquipment(): boolean {
        return this._isEquipment
    }

    get modelOrPlate(): string {
        return this._modelOrPlate
    }

    get hourMeterOrOdometer(): number {
        return this._rentInformation.hourMeterOrOdometer
    }
    get startRental(): string {
        return this._rentInformation.startRental
    }
    get monthlyPayment(): number {
        return this._rentInformation.monthlyPayment
    }
    get valuePerHourKm(): number {
        return this._rentInformation.valuePerHourKm
    }
    get valuePerDay(): number {
        return this._rentInformation.valuePerDay
    }

    get bank(): string {
        return this._bankInformation.bank
    }

    get beneficiary(): string {
        return this._bankInformation.beneficiary
    }

    get agency(): string {
        return this._bankInformation.agency
    }

    get account(): string {
        return this._bankInformation.account
    }

    get pix(): string {
        return this._bankInformation.pix
    }
}
