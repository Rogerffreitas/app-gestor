import TransportVehicleModel from '../../../database/model/TransportVehicleModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { BankInformation } from '../bank-information/BankInformation'
import Proprietary from '../proprietary/Proprietary'
import TransportVehicleDto from './TransportVehicleDto'

export class TransportVehicleEntity extends AbstratcEntity {
    private _motorist: string
    private _plate: string
    private _color: string
    private _capacity: number
    private _workId: string
    private _proprietary: Proprietary
    private _bankInformation: BankInformation

    modelToEntity(data: TransportVehicleModel): TransportVehicleEntity {
        this._motorist = data.motorist
        this._plate = data.plate
        this._color = data.color
        this._capacity = +data.capacity
        this._workId = data.workId
        this._proprietary = new Proprietary(
            data.nameProprietary,
            data.cpfCnpjProprietary,
            data.telProprietary
        )
        this._bankInformation = new BankInformation(
            data.bank,
            data.beneficiary,
            data.agency,
            data.account,
            data.pix
        )

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

    dtoToEntity(data: TransportVehicleDto): TransportVehicleEntity {
        this._motorist = data.motorist
        this._plate = data.plate
        this._color = data.color
        this._capacity = +data.capacity
        this._workId = data.workId
        this._proprietary = new Proprietary(
            data.nameProprietary,
            data.cpfCnpjProprietary,
            data.telProprietary
        )
        this._bankInformation = new BankInformation(
            data.bank,
            data.beneficiary,
            data.agency,
            data.account,
            data.pix
        )
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        return this
    }

    validate?(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity [TransportVehicleEntity]')
        let errorMessages: ErrorMessages[] = []

        if (!this._workId || this._workId.trim() === '') {
            errorMessages.push({ field: 'workId', message: 'O id da obra é obrigatório.' })
        }

        if (this._motorist == null || this._motorist.trim().length == 0) {
            changeErrorFields('motorist')('Obrigatório.')
            errorMessages.push({ field: 'motorist', message: 'O nome do motorista é obrigatório.' })
        }

        if (!this._capacity) {
            errorMessages.push({ field: 'capacity', message: 'Informe um Número Inteiro.' })
            changeErrorFields('capacity')('Obrigatótio')
        }

        if (this._capacity && this._capacity > 99999) {
            changeErrorFields('capacity')('Max. 99999 estacas')
            errorMessages.push({ field: 'capacity', message: 'Max. 99999' })
        }

        if (!Number.isInteger(this._capacity)) {
            errorMessages.push({ field: 'capacity', message: 'Informe um Número Inteiro.' })
            changeErrorFields('capacity')('Obrigatótio')
        }

        const plateRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/i
        const plate = this._plate ? this._plate.replace(/[^a-zA-Z0-9]/g, '') : ''

        if (plate.length === 0) {
            changeErrorFields('plate')('Obrigatório.')
            errorMessages.push({ field: 'plate', message: 'A placa é obrigatória.' })
        } else if (!plateRegex.test(plate)) {
            changeErrorFields('plate')('Inválido.')
            errorMessages.push({ field: 'plate', message: 'Formato de placa inválido.' })
        }

        if (this._color == null || this._color.trim().length === 0) {
            changeErrorFields('color')('Obrigatório.')
            errorMessages.push({ field: 'color', message: 'A cor é obrigatória.' })
        }

        errorMessages.push(...this._proprietary.validate(changeErrorFields))
        if (errorMessages.length > 0) {
            console.log(errorMessages)
        }
        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }
        console.log('Entity valid')
    }

    public get motorist(): string {
        return this._motorist
    }

    public get plate(): string {
        return this._plate
    }

    public get color(): string {
        return this._color
    }

    public get capacity(): number {
        return this._capacity
    }

    public get workId(): string {
        return this._workId
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

    get nameProprietary(): string {
        return this._proprietary.name
    }

    get cpfCnpjProprietary(): string {
        return this._proprietary.cpfCnpj
    }

    get telProprietary(): string {
        return this._proprietary.tel
    }
}
