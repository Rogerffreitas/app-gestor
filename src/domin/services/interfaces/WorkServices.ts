import WorkDto from '../../entity/work/WorkDto'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { ChangeErrorFields } from '../../../types'

export interface WorkServices {
    loadWorkListFromDatabase: (enterpriseId: string, userId: string, userRole: string) => Promise<WorkDto[]>
    createWorkInLocalDatabase: (dto: WorkDto, changeErrorFields: ChangeErrorFields) => Promise<WorkDto>
    updateWorkInLocalDatabase: (dto: WorkDto, changeErrorFields: ChangeErrorFields) => Promise<WorkDto>
    deleteWorkInLocalDatabase: (id: string, userId: string) => Promise<void>
    findWorkByIdInLocalDatabase: (id: string) => Promise<WorkDto>
    getAllRecordsByHttpRequest: (request: HttpRequest) => Promise<WorkDto[]>
}
