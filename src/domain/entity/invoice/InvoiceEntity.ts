import { ChangeErrorFields, InvoiceStatus, InvoiceTypes } from '../../types'
import AbstratcEntity from '../AbstratcEntity'
import { BankInformation } from '../bank-information/BankInformation'
import HourMeterMonitoringDto from '../hour-meter-monitoring/HourMeterMonitoringDto'
import MaterialTransportDto from '../material-transport/MaterialTransportDto'
import { InvoiceDto } from './InvoiceDto'
import WorkEquipmentDto from '../work-equipment/WorkEquipmentDto'
import TransportVehicleDto from '../transport-vehicle/TransportVehicleDto'
import DiscountDto from '../discount/DiscountDto'
import { FuelSupplyDto } from '../fuel-supply/FuelSupplyDto'
import { WorkEquipmentEntity } from '../work-equipment/WorkEquipmentEntity'
import { TransportVehicleEntity } from '../transport-vehicle/TransportVehicleEntity'
import { InvoiceProps } from '../../interfaces/props/InvoiceProps'

export class InvoiceEntity extends AbstratcEntity {
    private _startDate: number
    private _endDate: number
    private _invoiceType: string
    private _invoiceStatus: InvoiceStatus
    private _workId: string
    private _bankInformation: BankInformation
    private _transportVehicleOrWorkEquipment: TransportVehicleDto | WorkEquipmentDto
    private _description: string
    private _modelOrPlate: string
    private _dataList: MaterialTransportDto[] | HourMeterMonitoringDto[]
    private _discountsList: DiscountDto[]
    private _fuelSupliesList: FuelSupplyDto[]

    toEntity(props: InvoiceProps): InvoiceEntity {
        this.id = props.id
        this.serverId = props.serverId
        this._startDate = props.startDate
        this._endDate = props.endDate
        this._invoiceType = props.invoiceType
        this._invoiceStatus = props.invoiceStatus
        this._workId = props.workId
        this._bankInformation = props.bankInformation

        this._description = props.description
        this._modelOrPlate = props.modelOrPlate
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        if (props.invoiceType === InvoiceTypes.EQUIPMENT) {
            this._transportVehicleOrWorkEquipment = new WorkEquipmentDto().entityToDto(
                props.transportVehicleOrWorkEquipment as WorkEquipmentEntity
            )
            this._dataList =
                props.dataList?.map((item) => {
                    return new HourMeterMonitoringDto().entityToDto(item)
                }) ?? []
        } else if (props.invoiceType === InvoiceTypes.TRANSPORT_VEHICLE) {
            this._transportVehicleOrWorkEquipment = new TransportVehicleDto().entityToDto(
                props.transportVehicleOrWorkEquipment as TransportVehicleEntity
            )
            this._dataList =
                props.dataList?.map((item) => {
                    return new MaterialTransportDto().fromDto(item)
                }) ?? []
        }
        this._discountsList = props.discountsList?.map((item) => new DiscountDto().entityToDto(item)) ?? []
        this._fuelSupliesList =
            props.fuelSupliesList?.map((item) => new FuelSupplyDto().entityToDto(item)) ?? []
        return this
    }

    dtoToEntity(dto: InvoiceDto): InvoiceEntity {
        this._startDate = dto.startDate
        this._endDate = dto.endDate
        this._invoiceType = dto.invoiceType
        this._invoiceStatus = dto.invoiceStatus
        this._workId = dto.workId

        this._description = dto.description
        this._modelOrPlate = dto.modelOrPlate

        this.id = dto.id
        this.serverId = dto.serverId
        this.userId = dto.userId
        this.userAction = dto.userAction
        this.enterpriseId = dto.enterpriseId
        this.isValid = dto.isValid
        this.createdAt = Number(dto.createdAt)
        this.updatedAt = Number(dto.updatedAt)
        this._bankInformation = new BankInformation(
            dto.bank ? dto.bank : '',
            dto.beneficiary ? dto.beneficiary : '',
            dto.agency ? dto.agency : '',
            dto.account ? dto.account : '',
            dto.pix ? dto.pix : ''
        )

        this._transportVehicleOrWorkEquipment = dto.transportVehicleOrWorkEquipment
        this._discountsList = dto.discountsList
        this._fuelSupliesList = dto.fuelSupliesList
        this._dataList = dto.dataList

        return this
    }
    validate(changeErrorFields: ChangeErrorFields) {
        let errorMessages: { field: string; message: string }[] = []

        const addError = (field: string, message: string) => {
            errorMessages.push({ field, message })
            changeErrorFields(field)(message)
        }

        if (!this._startDate) addError('startDate', 'Data de início é obrigatória.')
        if (!this._endDate) addError('endDate', 'Data de término é obrigatória.')

        if (this._startDate && this._endDate && this._startDate > this._endDate) {
            addError('endDate', 'A data de término não pode ser anterior à data de início.')
        }

        if (!this._invoiceType || this._invoiceType.trim() === '')
            addError('invoiceType', 'O tipo da fatura é obrigatório.')
        if (!this._workId || this._workId.trim() === '')
            addError('workId', 'O ID da obra (workId) é obrigatório.')
        if (!this._description) addError('description', 'A descrição não pode ser nula.')

        if (!this._bankInformation) addError('bankInformation', 'As informações bancárias são obrigatórias.')

        if (!this._transportVehicleOrWorkEquipment.id) {
            addError('transportVehicleOrWorkEquipment', 'É necessário informar um veículo ou equipamento.')
        }

        if (!this._dataList || this._dataList.length === 0) {
            addError('dataList', 'A lista de Horimetro/transportes não pode estar vazia.')
        }
        const hasInvalidDataList = this._dataList.some(
            (item) => item.serverId === undefined || item.serverId === null
        )
        if (hasInvalidDataList) {
            addError('dataList', 'Todos os apontamentos devem possuir um serverId.')
        }

        const hasInvalidDiscount = this._discountsList.some(
            (item) => item.serverId === undefined || item.serverId === null
        )
        if (hasInvalidDiscount) {
            addError('discountsList', 'Todos os descontos devem possuir um serverId.')
        }

        // 3. FuelSuppliesList
        const hasInvalidFuel = this._fuelSupliesList.some((fuel) => !fuel.value || fuel.value <= 0)
        if (hasInvalidFuel) {
            addError('fuelSupliesList', 'Existem suprimentos de combustível com valores inválidos.')
        }

        if (errorMessages.length > 0) {
            console.info('Validation Errors:', errorMessages)
            const formattedErrors = errorMessages.map((err) => `[${err.field}]: ${err.message}`).join('\n- ')
            throw new Error(`Entity validation failed, cause: Erros de validação:\n- ${formattedErrors}`)
        }

        console.info('[InvoiceEntity] Entity valid')
    }

    get startDate(): number {
        return this._startDate
    }

    get endDate(): number {
        return this._endDate
    }

    get invoiceType(): string {
        return this._invoiceType
    }

    get invoiceStatus(): InvoiceStatus {
        return this._invoiceStatus
    }

    get workId(): string {
        return this._workId
    }

    get bankInformation(): BankInformation {
        return this._bankInformation
    }

    get transportVehicleOrWorkEquipment(): TransportVehicleDto | WorkEquipmentDto {
        return this._transportVehicleOrWorkEquipment
    }

    get description(): string {
        return this._description
    }

    get modelOrPlate(): string {
        return this._modelOrPlate
    }

    get dataList(): MaterialTransportDto[] | HourMeterMonitoringDto[] {
        return this._dataList
    }

    get discountsList(): DiscountDto[] {
        return this._discountsList
    }

    get fuelSupliesList(): FuelSupplyDto[] {
        return this._fuelSupliesList
    }
}
