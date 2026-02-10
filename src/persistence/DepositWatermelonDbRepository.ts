import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import DepositModel from "../database/model/DepositModel";
import DepositEntity from "../domin/entity/deposit/DepositEntity";
import { DepositRepositoryGateway } from "../domin/application/gateways/DepositRepositoryGateway";
import { UserAction } from "../types";

export class DepositWatermelonDbRepository implements DepositRepositoryGateway {
  async createDepositInLocalDatabase(
    entity: DepositEntity
  ): Promise<DepositEntity> {
    try {
      const entityCreated = await database.write(async () => {
        return await database.get<DepositModel>("deposits").create((item) => {
          item.description = entity.description;
          item.name = entity.name;
          item.serverId = entity.serverId;
          item.enterpriseId = entity.enterpriseId;
          item.userId = entity.userId;
          item.userAction = entity.userAction;
          item.isValid = true;
        });
      });

      return new DepositEntity().modelToEntity(entityCreated);
    } catch (error) {
      console.log("[Deposits]: " + error);
      throw new Error("Error create deposit in local database.", {
        cause: error.message,
      });
    }
  }
  async updateDepositInLocalDatabase(
    entity: DepositEntity
  ): Promise<DepositEntity> {
    try {
      const entityUpdeted = await database.write(async () => {
        const item = await database
          .get<DepositModel>("deposits")
          .find(entity.id);
        return await item.update(() => {
          item.description = entity.description;
          item.name = entity.name;
          item.userId = entity.userId;
          item.userAction = entity.userAction;
        });
      });
      return new DepositEntity().modelToEntity(entityUpdeted);
    } catch (error) {
      console.log("[Deposits]: " + error);
      throw new Error("Error updating deposit in local database.", {
        cause: error.message,
      });
    }
  }
  async deleteDepositInLocalDatabase(
    id: string,
    userId: string
  ): Promise<void> {
    const t = await database
      .get("work_routes")
      .query(
        Q.unsafeSqlQuery(
          `select count(*) as count from work_routes where deposit_id = ?`,
          [id]
        )
      )

      .fetchCount();

    const result = t;
    if (result > 0) {
      throw new Error("Não é possível apagar a Jazida");
    }
    try {
      let result;

      await database.write(async () => {
        const result = await database.get<DepositModel>("deposits").find(id);
        await result.update(() => {
          result.userAction = UserAction.DELETE;
          result.userId = userId;
          result.isValid = false;
        });
      });
      return result;
    } catch (error) {
      console.log("[Deposits]: " + error);
      throw new Error("Error deleting deposit routes in local database.", {
        cause: error,
      });
    }
  }
  findDepositByIdInLocalDatabase(id: string): Promise<DepositEntity> {
    throw new Error("Method not implemented.");
  }
  async loadAllDepositByEnterpriseIdFromLocalDatabase(
    enterpriseId: string
  ): Promise<DepositEntity[]> {
    try {
      const result = await database
        .get<DepositModel>("deposits")
        .query(
          Q.sortBy("created_at", Q.desc),
          Q.where("enterprise_id", enterpriseId),
          Q.where("is_valid", true)
        )
        .fetch();
      return result.map((item) => {
        return new DepositEntity().modelToEntity(item);
      });
    } catch (error) {
      console.log("[Deposits]: " + error);
      throw new Error("Error loading deposit from local database.", {
        cause: error,
      });
    }
  }

  async saveDepositServerId(entitys: DepositEntity[]): Promise<void> {
    const result = entitys.map(async (item) => {
      await database
        .write(async () => {
          const result = await database
            .get<DepositModel>("deposits")
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
