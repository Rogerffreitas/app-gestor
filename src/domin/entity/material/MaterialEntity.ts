import MaterialModel from "../../../database/model/MaterialModel";
import { ChangeErrorFields, ErrorMessages } from "../../../types";
import { Reference } from "../../../types";
import AbstratcEntity from "../AbstratcEntity";
import { MaterialDto } from "./MaterialDto";

export default class MaterialEntity extends AbstratcEntity {
  private _name: string;
  private _density: number;
  private _referenceMaterialCalculation: Reference;
  private _value: number;
  private _depositId: string;

  dtoToEntity?(data: MaterialDto): MaterialEntity {
    this._name = data.name;
    this._density = data.density;
    this._referenceMaterialCalculation = data.referenceMaterialCalculation;
    this._value = data.value;
    this._depositId = data.depositId;
    this.serverId = data.serverId;
    this.id = data.id;
    this.userId = data.userId;
    this.userAction = data.userAction;
    this.enterpriseId = data.enterpriseId;
    this.isValid = data.isValid;
    this.createdAt = +data.createdAt;
    this.updatedAt = +data.updatedAt;
    this.status = data.status;
    return this;
  }

  modelToEntity?(data: MaterialModel): MaterialEntity {
    this._name = data.name;
    this._density = data.density;
    this._referenceMaterialCalculation = data.referenceMaterialCalculation;
    this._value = data.value;
    this._depositId = data.depositId;
    this.serverId = data.serverId;
    this.id = data.id;
    this.userId = data.userId;
    this.userAction = data.userAction;
    this.enterpriseId = data.enterpriseId;
    this.isValid = data.isValid;
    this.createdAt = +data.createdAt;
    this.updatedAt = +data.updatedAt;
    this.status = data._raw._status;
    return this;
  }

  validate?(changeErrorFields: ChangeErrorFields) {
    console.log("validated entity [MaterialEntity]");
    let errorMessages: ErrorMessages[] = [];

    if (this._name == null || this._name.length == 0) {
      changeErrorFields("name")("Preencha o campo obrigatório");
      errorMessages.push({
        field: "name",
        message: "Preencha o campo obrigatório",
      });
    }

    if (this._name.length > 50) {
      changeErrorFields("name")("Max. 50 caracteres");
      errorMessages.push({ field: "name", message: "Max. 50 caracteres" });
    }

    if (this._density == null || this._density == 0) {
      changeErrorFields("density")("Preencha o campo obrigatório");
      errorMessages.push({
        field: "density",
        message: "Preencha o campo obrigatório",
      });
    }

    if (this._value == null || this._value == 0) {
      changeErrorFields("value")("Preencha o campo obrigatório");
      errorMessages.push({
        field: "value",
        message: "Preencha o campo obrigatório",
      });
    }

    if (this._density > 9999) {
      changeErrorFields("density")("Max. 99");
      errorMessages.push({ field: "density", message: "Max. 99" });
    }

    if (this._value > 999999999) {
      changeErrorFields("value")("Max. 999999");
      errorMessages.push({ field: "value", message: "Max. 999999" });
    }

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

  public get name(): string {
    return this._name;
  }

  public get density(): number {
    return this._density;
  }

  public get referenceMaterialCalculation(): Reference {
    return this._referenceMaterialCalculation;
  }

  public get value(): number {
    return this._value;
  }

  public get depositId(): string {
    return this._depositId;
  }
}
