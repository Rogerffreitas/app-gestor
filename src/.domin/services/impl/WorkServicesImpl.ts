import WorkDto from '../../entity/work/WorkDto'
import { HttpClientGateway } from '../../application/gateways/HttpClientGateway'
import { WorkRepositoryGateway } from '../../application/gateways/WorkRepositoryGateway'
import WorkEntity from '../../entity/work/WorkEntity'
import { WorkServices } from '../interfaces/WorkServices'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { UserRoles } from '../../../types'
import { ChangeErrorFields } from '../../../types'

export class WorkServicesImpl implements WorkServices {
    constructor(
        private workRepository: WorkRepositoryGateway,
        private httpClient: HttpClientGateway
    ) {}

    deleteWorkInLocalDatabase(id: string, userId: string) {
        return this.workRepository.deleteWorkInLocalDatabase(id, userId)
    }

    async updateWorkInLocalDatabase(dto: WorkDto, changeErrorFields: ChangeErrorFields): Promise<WorkDto> {
        const work = new WorkEntity().dtoToEntity(dto)
        work.validate(changeErrorFields)
        return new WorkDto().entityToDto(await this.workRepository.updateWorkInLocalDatabase(work))
    }

    async findWorkByIdInLocalDatabase(id: string): Promise<WorkDto | null> {
        return new WorkDto().entityToDto(await this.workRepository.findWorkByIdInLocalDatabase(id))
    }

    async createWorkInLocalDatabase(dto: WorkDto, changeErrorFields: ChangeErrorFields): Promise<WorkDto> {
        const work = new WorkEntity().dtoToEntity(dto)
        work.validate(changeErrorFields)
        return new WorkDto().entityToDto(await this.workRepository.createWorkInLocalDatabase(work))
    }

    async loadWorkListFromDatabase(
        enterpriseId: string,
        userId: string,
        userRole: string
    ): Promise<WorkDto[]> {
        if (userRole != UserRoles.ADMIN) {
            const result = await this.workRepository.loadAllWorksByEnterpriseIdAndUserIdFromLocalDatabase(
                enterpriseId,
                userId
            )
            return result.map((item) => new WorkDto().entityToDto(item))
        }

        const result = this.workRepository.loadAllWorksByEnterpriseIdFromLocalDatabase(enterpriseId)
        return (await result).map((item) => new WorkDto().entityToDto(item))
    }

    async loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
        enterpriseId: string,
        userId: string,
        userRole: string
    ): Promise<WorkDto[]> {
        if (userRole != UserRoles.ADMIN) {
            const result =
                await this.workRepository.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                    enterpriseId,
                    userId
                )
            return result.map((item) => new WorkDto().entityToDto(item))
        }

        const result = this.workRepository.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
            enterpriseId,
            ''
        )
        return (await result).map((item) => new WorkDto().entityToDto(item))
    }

    async getAllRecordsByHttpRequest(request: HttpRequest): Promise<WorkDto[]> {
        const result = await this.httpClient.getAllRecordsByHttpRequest<WorkEntity>(request)
        return result.map((item) => new WorkDto().entityToDto(item))
    }
}
