import WorkEquipmentModel from '../../../database/model/WorkEquipmentModel'
import { ChangeErrorFields, ErrorMessages } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { EquipmentEntity } from '../equipment/EquipmentEntity'
import RentInformation from '../rent-information/RentInformation'
import WorkEquipmentDto from './WorkEquipmentDto'

export class WorkEquipmentEntity extends AbstratcEntity {
    private _equipment: EquipmentEntity
    private _rentInformation: RentInformation
    private _operatorMotorist: string
    private _workId: string

    get equipment(): EquipmentEntity {
        return this._equipment
    }

    get workId(): string {
        return this._workId
    }

    get nameProprietary(): string {
        return this._equipment.nameProprietary
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

    get isEquipment(): boolean {
        return this._equipment.isEquipment
    }

    get modelOrPlate(): string {
        return this._equipment.modelOrPlate
    }

    get operatorMotorist(): string {
        return this._operatorMotorist
    }

    public validate(changeErrorFields: ChangeErrorFields) {
        console.log('validated entity')
        let errorMessages: ErrorMessages[] = []

        if (!this._equipment) {
            errorMessages.push({ field: 'equipment', message: 'Equipamento é obrigatório.' })
        }

        if (!this._operatorMotorist || this._operatorMotorist.trim() === '') {
            errorMessages.push({
                field: 'operatorMotorist',
                message: 'O nome do operador/motorista não pode ser vazio.',
            })
        }

        if (!this._workId || this._workId.trim() === '') {
            errorMessages.push({ field: 'workId', message: 'O id da obra é obrigatório.' })
        }

        errorMessages.push(...this._rentInformation.validate(changeErrorFields))

        if (errorMessages.length > 0) {
            throw new Error('Entity validation failed', {
                cause: 'Erros de validação:\n- ' + errorMessages.join('\n- '),
            })
        }

        console.log('valid entity')
    }

    public async modelToEntity(data: WorkEquipmentModel) {
        this._rentInformation = new RentInformation(
            +data.hourMeterOrOdometer,
            data.startRental,
            +data.monthlyPayment,
            +data.valuePerHourKm,
            +data.valuePerDay
        )
        this._equipment = new EquipmentEntity().modelToEntity(await data.equipment())
        this._operatorMotorist = data.operatorMotorist
        this._workId = data.workId
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

    public dtoToEntity(data: WorkEquipmentDto): WorkEquipmentEntity {
        this._equipment = new EquipmentEntity().dtoToEntity(data.equipment)
        this._rentInformation = new RentInformation(
            +data.hourMeterOrOdometer,
            data.startRental,
            +data.monthlyPayment,
            +data.valuePerHourKm,
            +data.valuePerDay
        )
        this._operatorMotorist = data.operatorMotorist
        this._workId = data.workId
        this.serverId = data.serverId
        this.id = data.id
        this.userId = data.userId
        this.userAction = data.userAction
        this.enterpriseId = data.enterpriseId
        this.isValid = data.isValid
        this.createdAt = +data.createdAt
        this.updatedAt = +data.updatedAt
        return this
    }
}
