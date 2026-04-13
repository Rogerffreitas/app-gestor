import { InvoiceStatus } from '../../../types'
import AbstratcEntity from '../AbstratcEntity'
import { BankInformation } from '../bank-information/BankInformation'
import DiscountDto from '../discount/DiscountDto'
import { FuelSupplyDto } from '../fuel-supply/FuelSupplyDto'
import HourMeterMonitoringDto from '../hour-meter-monitoring/HourMeterMonitoringDto'
import MaterialTransportDto from '../material-transport/MaterialTransportDto'
import TransportVehicleDto from '../transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../work-equipment/WorkEquipmentDto'
import { InvoiceDto } from './InvoiceDto'

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

    dtoToEntity(dto: InvoiceDto): InvoiceEntity {
        this._startDate = dto.startDate
        this._endDate = dto.endDate
        this._invoiceType = dto.invoiceType
        this._invoiceStatus = dto.invoiceStatus
        this._workId = dto.workId
        this._description = dto.description
        this._modelOrPlate = dto.modelOrPlate
        this._transportVehicleOrWorkEquipment = dto.transportVehicleOrWorkEquipment
        this.id = dto.id
        this.serverId = dto.serverId
        this.userId = dto.userId
        this.userAction = dto.userAction
        this.enterpriseId = dto.enterpriseId
        this.isValid = dto.isValid
        this.createdAt = dto.createdAt
        this.updatedAt = dto.updatedAt
        this._bankInformation = new BankInformation(
            dto.bank,
            dto.beneficiary,
            dto.agency,
            dto.account,
            dto.pix
        )

        this._discountsList = dto.discountsList
        this._fuelSupliesList = dto.fuelSupliesList
        this._dataList = dto.dataList
        return this
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
