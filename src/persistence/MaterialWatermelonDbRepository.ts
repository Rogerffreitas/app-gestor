import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import MaterialEntity from "../domin/entity/material/MaterialEntity";
import MaterialModel from "../database/model/MaterialModel";
import { MaterialRepositoryGateway } from "../domin/application/gateways/MaterialRepositoryGateway";
import { UserAction } from "../types";

export class MaterialWatermelonDbRepository
  implements MaterialRepositoryGateway
{
  async createMaterialInLocalDatabase(
    entity: MaterialEntity
  ): Promise<MaterialEntity> {
    try {
      const entityCreated = await database.write(async () => {
        return await database.get<MaterialModel>("materials").create((item) => {
          item.name = entity.name;
          item.density = +entity.density;
          item.referenceMaterialCalculation =
            entity.referenceMaterialCalculation;
          item.depositId = entity.depositId;
          item.value = +entity.value;
          item.serverId = entity.serverId;
          item.enterpriseId = entity.enterpriseId;
          item.userId = entity.userId;
          item.userAction = entity.userAction;
          item.isValid = true;
        });
      });

      return new MaterialEntity().modelToEntity(entityCreated);
    } catch (error) {
      console.log("[Material]: " + error);
      throw new Error("Error create material in local database.", {
        cause: error,
      });
    }
  }
  async updateMaterialInLocalDatabase(
    entity: MaterialEntity
  ): Promise<MaterialEntity> {
    try {
      const entityUpdated = await database.write(async () => {
        const item = await database
          .get<MaterialModel>("materials")
          .find(entity.id);
        return await item.update(() => {
          item.name = entity.name;
          item.density = entity.density;
          item.referenceMaterialCalculation =
            entity.referenceMaterialCalculation;
          item.depositId = entity.depositId;
          item.value = +entity.value;
          item.userAction = UserAction.UPDATE;
          item.userId = entity.userId;
        });
      });
      return new MaterialEntity().modelToEntity(entityUpdated);
    } catch (error) {
      console.log("[Material]: " + error);
      throw new Error("Error updating material in local database.", {
        cause: error,
      });
    }
  }
  async deleteMaterialInLocalDatabase(
    id: string,
    userId: string
  ): Promise<void> {
    const t = await database
      .get("transportes")
      .query(
        Q.unsafeSqlQuery(
          `select count(*) as count from transportes where rota_id = ?`,
          [id]
        )
      )
      .fetchCount();
    console.log(t);

    if (t > 0) {
      throw new Error("Não é possível apagar a Rota");
    }
    try {
      let result;

      await database.write(async () => {
        const result = await database.get<MaterialModel>("materials").find(id);
        await result.update(() => {
          result.userAction = UserAction.DELETE;
          result.userId = userId;
          result.isValid = false;
        });
      });
      return result;
    } catch (error) {
      console.log("[Material]: " + error);
      throw new Error("Error deleting work routes in local database.", {
        cause: error,
      });
    }
  }
  findMaterialByIdInLocalDatabase(id: string): Promise<MaterialEntity> {
    throw new Error("Method not implemented.");
  }

  async loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
    enterpriseId: string,
    depositId: string
  ): Promise<MaterialEntity[]> {
    try {
      const result = await database
        .get<MaterialModel>("materials")
        .query(
          Q.sortBy("created_at", Q.desc),
          Q.where("deposit_id", depositId),
          Q.where("enterprise_id", enterpriseId),
          Q.where("is_valid", true)
        )
        .fetch();
      return result.map((item) => {
        return new MaterialEntity().modelToEntity(item);
      });
    } catch (error) {
      console.log("[Material]: " + error);
      throw new Error("Error loading material from local database.", {
        cause: error,
      });
    }
  }

  async loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
    enterpriseId: string,
    depositId: string
  ): Promise<MaterialEntity[]> {
    try {
      const result = await database
        .get<MaterialModel>("materials")
        .query(
          Q.where("is_valid", true),
          Q.sortBy("created_at", Q.desc),
          Q.where("deposit_id", depositId),
          Q.where("enterprise_id", enterpriseId),
          Q.where("server_id", Q.gt(0))
        )
        .fetch();

      return result.map((item) => {
        return new MaterialEntity().modelToEntity(item);
      });
    } catch (error) {
      console.log("[Material]: " + error);
      throw new Error("Error loading material from local database.", {
        cause: error,
      });
    }
  }

  async saveMaterialServerId(entitys: MaterialEntity[]): Promise<void> {
    const result = entitys.map(async (item) => {
      await database
        .write(async () => {
          const result = await database
            .get<MaterialModel>("materials")
            .find(item.id);
          await result.update(() => {
            result.serverId = item.serverId;
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
  }
}
