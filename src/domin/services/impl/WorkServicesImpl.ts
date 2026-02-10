import WorkDto from "../../entity/work/WorkDto";
import HttpClientGateway from "../../application/gateways/HttpClientGateway";
import { WorkRepositoryGateway } from "../../application/gateways/WorkRepositoryGateway";
import WorkEntity from "../../entity/work/WorkEntity";
import { WorkServices } from "../interfaces/WorkServices";
import { HttpRequest } from "../../entity/http/dtos/HttpRequest";
import { UserRoles } from "../../../types";
import { ChangeErrorFields } from "../../../types";

export class WorkServicesImpl implements WorkServices {
  private workRepositoryGateway: WorkRepositoryGateway;
  private httpClientGateway: HttpClientGateway<WorkEntity>;

  constructor(
    workRepository: WorkRepositoryGateway,
    httpClientGateway: HttpClientGateway<WorkEntity>
  ) {
    this.workRepositoryGateway = workRepository;
    this.httpClientGateway = httpClientGateway;
  }
  deleteWorkInLocalDatabase(id: string, userId: string) {
    return this.workRepositoryGateway.deleteWorkInLocalDatabase(id, userId);
  }

  updateWorkInLocalDatabase(
    dto: WorkDto,
    changeErrorFields: ChangeErrorFields
  ): Promise<WorkDto> {
    const work = new WorkEntity().dtoToEntity(dto);
    work.validate(changeErrorFields);
    return this.workRepositoryGateway.updateWorkInLocalDatabase(work);
  }

  findWorkByIdInLocalDatabase(id: string): Promise<WorkDto | null> {
    return this.workRepositoryGateway.findWorkByIdInLocalDatabase(id);
  }

  async createWorkInLocalDatabase(
    dto: WorkDto,
    changeErrorFields: ChangeErrorFields
  ): Promise<WorkDto> {
    const work = new WorkEntity().dtoToEntity(dto);
    work.validate(changeErrorFields);
    return new WorkDto().entityToDto(
      await this.workRepositoryGateway.createWorkInLocalDatabase(work)
    );
  }

  async loadWorkListFromDatabase(
    enterpriseId: string,
    userId: string,
    userRole: string
  ): Promise<WorkDto[]> {
    if (userRole != UserRoles.ADMIN) {
      const result =
        await this.workRepositoryGateway.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
          enterpriseId,
          userId
        );
      return result.map((item) => new WorkDto().entityToDto(item));
    }

    const result =
      this.workRepositoryGateway.loadAllWorksByEnterpriseIdFromLocalDatabase(
        enterpriseId
      );
    return (await result).map((item) => new WorkDto().entityToDto(item));
  }

  async getAllRecordsByHttpRequest(request: HttpRequest): Promise<WorkDto[]> {
    return await this.httpClientGateway.getAllRecordsByHttpRequest(request);
  }
}
