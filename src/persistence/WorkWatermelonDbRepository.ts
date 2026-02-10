import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import WorkModel from "../database/model/WorkModel";
import { WorkRepositoryGateway } from "../domin/application/gateways/WorkRepositoryGateway";
import WorkEntity from "../domin/entity/work/WorkEntity";
import { UserAction } from "../types";
import { TableName } from "../types";

export class WorkWatermelonDbRepository implements WorkRepositoryGateway {
  async createWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity> {
    try {
      const entityCreated = await database.write(async () => {
        return await database.get<WorkModel>(TableName.WORKS).create((work) => {
          work.name = entity.name;
          work.description = entity.description;
          work.pickets = +entity.pickets;
          work.enterpriseId = entity.enterpriseId;
          work.userId = entity.userId;
          work.userAction = entity.userAction;
          work.usersList = entity.usersList;
          work.isValid = entity.isValid;
          work.serverId = entity.serverId;
        });
      });
      return new WorkEntity().modelToEntity(entityCreated);
    } catch (error) {
      console.log("[WorkRepository]: " + error);
      throw new Error("Error create work in local database.", { cause: error });
    }
  }
  async updateWorkInLocalDatabase(entity: WorkEntity): Promise<WorkEntity> {
    try {
      const entityUpdated = await database.write(async () => {
        const result = await database
          .get<WorkModel>(TableName.WORKS)
          .find(entity.id);
        return await result.update(() => {
          result.userAction = entity.userAction;
          result.userId = entity.userId;
          result.name = entity.name;
          result.description = entity.description;
          result.pickets = +entity.pickets;
          result.isValid = entity.isValid;
        });
      });
      return new WorkEntity().modelToEntity(entityUpdated);
    } catch (error) {
      console.log("[WorkRepositoty]: " + error);
      throw new Error("Error updating work in local database.", {
        cause: error,
      });
    }
  }
  async deleteWorkInLocalDatabase(id: string, userId: string): Promise<void> {
    const [transportCount, fuelCount, discountCount] = await Promise.all([
      database
        .get(TableName.MATERIAL_TRANSPORTS)
        .query(Q.where("work_id", id))
        .fetchCount(),
      database
        .get(TableName.FUEL_SUPPLYS)
        .query(Q.where("work_id", id))
        .fetchCount(),
      database
        .get(TableName.DISCOUNTS)
        .query(Q.where("work_id", id))
        .fetchCount(),
    ]);

    const totalDependencies = transportCount + fuelCount + discountCount;

    if (totalDependencies > 0) {
      throw new Error(
        "A obra não pode ser excluída, pois existem registros associados (transporte, combustível ou descontos)."
      );
    }

    try {
      await database.write(async () => {
        const workToUpdate = await database
          .get<WorkModel>(TableName.WORKS)
          .find(id);
        await workToUpdate.update(() => {
          workToUpdate.userAction = UserAction.DELETE;
          workToUpdate.userId = userId;
          workToUpdate.isValid = false;
        });
      });
    } catch (error) {
      console.error(
        "[WorkRepositoty]: Error deleting work in local database.",
        error
      );
      throw new Error("Error deleting work in local database.", {
        cause: error,
      });
    }
  }
  async findWorkByIdInLocalDatabase(id: string): Promise<WorkEntity> {
    try {
      const result = await database.get<WorkModel>(TableName.WORKS).find(id);
      return new WorkEntity().modelToEntity(result);
    } catch (error) {
      throw new Error("Method not implemented.");
    }
  }
  async loadAllWorksByEnterpriseIdFromLocalDatabase(
    enterpriseId: string
  ): Promise<WorkEntity[]> {
    try {
      const result = await database
        .get<WorkModel>(TableName.WORKS)
        .query(
          Q.sortBy("created_at", Q.desc),
          Q.where("enterprise_id", enterpriseId),
          Q.where("is_valid", true)
        )
        .fetch();
      return result.map((item: WorkModel) => {
        return new WorkEntity().modelToEntity(item);
      });
    } catch (error) {
      console.log("[WorkRepositoty]: " + error);
      throw new Error("Error loading works from local database.", {
        cause: error,
      });
    }
  }
  async loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
    enterpriseId: string,
    userId: string
  ): Promise<WorkEntity[]> {
    try {
      const result = await database
        .get<WorkModel>(TableName.WORKS)
        .query(
          Q.sortBy("created_at", Q.desc),
          Q.where("enterprise_id", enterpriseId),
          Q.where("is_valid", true),
          Q.where("users_list", Q.like(`%${userId}%`))
        )
        .fetch();
      return result.map((item: WorkModel) => {
        return new WorkEntity().modelToEntity(item);
      });
    } catch (error) {
      console.log("[WorkRepositoty]: " + error);
      throw new Error("Error loading works from local database.", {
        cause: error,
      });
    }
  }
  async saveWorkServerId(entitys: WorkEntity[]): Promise<void> {
    const result = entitys.map(async (item) => {
      await database
        .write(async () => {
          const result = await database
            .get<WorkModel>(TableName.WORKS)
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
