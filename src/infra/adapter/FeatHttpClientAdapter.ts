import HttpClientGateway from '../../domin/application/gateways/HttpClientGateway'
import { HttpRequest } from '../../domin/dtos/HttpRequest'
import WorkEntity from '../../domin/entity/work/WorkEntity'

export class FeatHttpClientAdapter implements HttpClientGateway<WorkEntity> {
    getAllRecordsByHttpRequest: (request: HttpRequest) => Promise<WorkEntity[]>
    getRecordsByHttpRequest: (request: HttpRequest) => Promise<WorkEntity>
    httpRequestPost: (request: HttpRequest) => Promise<WorkEntity>
}
