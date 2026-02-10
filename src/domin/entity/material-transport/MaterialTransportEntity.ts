import MaterialTransportModel from "../../../database/model/MaterialTransportModel";
import { ChangeErrorFields, ErrorMessages } from "../../../types";
import { Reference } from "../../../types";
import AbstratcEntity from "../AbstratcEntity";
import MaterialEntity from "../material/MaterialEntity";
import { TransportVehicleEntity } from "../transport-vehicle/TransportVehicleEntity";
import WorkRoutesEntity from "../work-routes/WorkRoutesEntity";
import MaterialTransportDto from "./MaterialTransportDto";

export class MaterialTransportEntity extends AbstratcEntity {
  private _workRoutes: WorkRoutesEntity;
  private _transportVehicle: TransportVehicleEntity;
  private _material: MaterialEntity;

  private _value: number;
  private _isReferenceCapacity: boolean;
  private _quantity: number;
  private _deliveryPicket: string;
  private _totalPickets: number;
  private _distanceTraveledWithinTheWork: number;
  private _observation: string;

  private _invoiceId: number;
  private _invoiceStatus: string;
  private _workId: string;

  public static dtoToEntity(
    data: MaterialTransportDto
  ): MaterialTransportEntity {
    const entity = new MaterialTransportEntity();
    let totalValue = 0;
    let displacementFloat = data.workRoutesDto.km / 100;
    let unitCostOfTheRouteFloat = data.workRoutesDto.value / 1000;
    let quantityFloat = data.quantity / 100;
    let dmtPicketTotal = data.totalPickets * 20; //dmtPicketTotal em METROS / 1000 para converter em KM
    let extraDMT = dmtPicketTotal / 1000;
    let totalKm = displacementFloat + extraDMT;

    if (data.workRoutesDto.isFixedValue) {
      totalValue = data.workRoutesDto.value;
    }

    if (
      !data.workRoutesDto.isFixedValue &&
      data.materialDto.referenceMaterialCalculation === Reference.VOLUME
    ) {
      let costCapacity =
        unitCostOfTheRouteFloat * data.transportVehicleDto.capacity;
      totalValue = parseInt(
        (parseFloat(costCapacity.toFixed(3)) * totalKm)
          .toFixed(2)
          .replace(".", "")
      );
    }

    if (
      !data.workRoutesDto.isFixedValue &&
      data.materialDto.referenceMaterialCalculation === Reference.WEIGHT
    ) {
      let costDisplacement = unitCostOfTheRouteFloat * quantityFloat;
      totalValue = parseInt(
        (parseFloat(costDisplacement.toFixed(3)) * totalKm)
          .toFixed(2)
          .replace(".", "")
      );
    }

    entity._quantity = data.quantity;
    if (data.materialDto.referenceMaterialCalculation === Reference.VOLUME) {
      entity._quantity = data.transportVehicleDto.capacity;
    }

    entity._distanceTraveledWithinTheWork = parseInt(
      extraDMT.toFixed(2).replace(".", "")
    );

    entity._isReferenceCapacity =
      data.materialDto.referenceMaterialCalculation === Reference.VOLUME;
    entity._deliveryPicket = data.deliveryPicket;
    entity._workRoutes = new WorkRoutesEntity().dtoToEntity(data.workRoutesDto);
    entity._transportVehicle = new TransportVehicleEntity().dtoToEntity(
      data.transportVehicleDto
    );
    entity._material = new MaterialEntity().dtoToEntity(data.materialDto);
    entity._value = totalValue;
    entity._totalPickets = data.totalPickets;
    entity._observation = data.observation;
    entity._invoiceId = data.invoiceId;
    entity._invoiceStatus = data.invoiceStatus;
    entity._workId = data.workId;
    entity.userId = data.userId;
    entity.userAction = data.userAction;
    entity.enterpriseId = data.enterpriseId;
    return entity;
  }

  public async modelToEntity(
    data: MaterialTransportModel
  ): Promise<MaterialTransportEntity> {
    const entity = new MaterialTransportEntity();
    entity._workRoutes = await new WorkRoutesEntity().modelToEntity(
      await data.workRoutes()
    );

    entity._transportVehicle = new TransportVehicleEntity().modelToEntity(
      await data.transportVehicle()
    );

    entity._material = new MaterialEntity().modelToEntity(
      await data.material()
    );
    entity._value = data.value;
    entity._isReferenceCapacity = data.isReferenceCapacity;
    entity._quantity = data.quantity;
    entity._deliveryPicket = data.deliveryPicket;
    entity._totalPickets = data.totalPickets;
    entity._distanceTraveledWithinTheWork = data.distanceTraveledWithinTheWork;
    entity._observation = data.observation;
    entity._invoiceId = data.invoiceId;
    entity._invoiceStatus = data.invoiceStatus;
    entity._workId = data.workId;
    entity.serverId = data.serverId;
    entity.userId = data.userId;
    entity.userAction = data.userAction;
    entity.enterpriseId = data.enterpriseId;
    entity.isValid = data.isValid;
    entity.id = data.id;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    entity.status = data._raw._status;
    return entity;
  }

  validate?(changeErrorFields: ChangeErrorFields) {
    console.log("validated entity [MaterialTransportEntity]");
    let errorMessages: ErrorMessages[] = [];

    if (!this._workId) {
      errorMessages.push({
        field: "workId",
        message: "Work validation failed",
      });
      throw new Error("Entity validation failed", {
        cause: "Work validation failed",
      });
    }

    if (!this._value || this._value == 0) {
      errorMessages.push({
        field: "value",
        message: "Preencha o campo obrigatório",
      });
      changeErrorFields("value")("Preencha o campo obrigatório");
    }

    if (
      (!this._quantity && !this.isReferenceCapacity) ||
      (this._quantity == 0 && !this.isReferenceCapacity)
    ) {
      errorMessages.push({
        field: "quantity",
        message: "Preencha o campo obrigatório",
      });
      changeErrorFields("quantity")("Preencha o campo obrigatório");
    }

    if (
      this._totalPickets === undefined &&
      this.totalPickets === null &&
      this.isReferenceCapacity
    ) {
      errorMessages.push({
        field: "totalPickets",
        message: "Preencha o campo obrigatório",
      });
      changeErrorFields("totalPickets")("Preencha o campo obrigatório");
    }

    if (
      this._distanceTraveledWithinTheWork === undefined &&
      this._distanceTraveledWithinTheWork === null &&
      this.isReferenceCapacity
    ) {
      errorMessages.push({
        field: "distanceTraveledWithinTheWork",
        message: "Preencha o campo obrigatório",
      });
      changeErrorFields("distanceTraveledWithinTheWork")(
        "Preencha o campo obrigatório"
      );
    }

    this._transportVehicle.validate(changeErrorFields);
    this._workRoutes.validate(changeErrorFields);
    this._material.validate(changeErrorFields);

    if (errorMessages.length > 0) {
      console.log(errorMessages);
    }

    if (errorMessages.length > 0) {
      throw new Error("Entity validation failed", {
        cause: "Erros de validação:\n- " + errorMessages.join("\n- "),
      });
    }
    console.log("Entity valid");
  }

  public get workRoutes(): WorkRoutesEntity {
    return this._workRoutes;
  }

  public get transportVehicle(): TransportVehicleEntity {
    return this._transportVehicle;
  }

  public get material(): MaterialEntity {
    return this._material;
  }

  public get value(): number {
    return this._value;
  }

  public get isReferenceCapacity(): boolean {
    return this._isReferenceCapacity;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get deliveryPicket(): string {
    return this._deliveryPicket;
  }

  public get totalPickets(): number {
    return this._totalPickets;
  }

  public get distanceTraveledWithinTheWork(): number {
    return this._distanceTraveledWithinTheWork;
  }

  public get observation(): string {
    return this._observation;
  }

  public get invoiceId(): number {
    return this._invoiceId;
  }

  public get invoiceStatus(): string {
    return this._invoiceStatus;
  }

  public get workId(): string {
    return this._workId;
  }

  public get transportVehicleId(): string {
    return this._transportVehicle.id;
  }

  get nameProprietary(): string {
    return this._transportVehicle.nameProprietary;
  }

  get cpfCnpjProprietary(): string {
    return this._transportVehicle.cpfCnpjProprietary;
  }

  get telProprietary(): string {
    return this._transportVehicle.telProprietary;
  }

  public get motorist(): string {
    return this._transportVehicle.motorist;
  }

  public get plate(): string {
    return this._transportVehicle.plate;
  }
  public get capacity(): number {
    return this._transportVehicle.capacity;
  }

  public get materialId(): string {
    return this._material.id;
  }
  public get materialName(): string {
    return this._material.name;
  }

  public get workRoutesId(): string {
    return this._workRoutes.id;
  }

  public get arrivalLocation(): string {
    return this._workRoutes.arrivalLocation;
  }

  public get departureLocation(): string {
    return this._workRoutes.departureLocation;
  }

  public get km(): number {
    return this._workRoutes.km;
  }

  public get unitValue(): number {
    return this._workRoutes.value;
  }
}
