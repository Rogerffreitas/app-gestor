import { HttpClientGateway } from '../domin/application/gateways/HttpClientGateway'
import { HttpRequest } from '../domin/entity/http/dtos/HttpRequest'

import WorkEntity from '../domin/entity/work/WorkEntity'

export class FeatHttpClientAdapter implements HttpClientGateway {
    getAllRecordsByHttpRequest: <T>(request: HttpRequest) => Promise<T>
    getRecordsByHttpRequest: <T>(request: HttpRequest) => Promise<T>
    httpRequestPost: <T>(request: HttpRequest) => Promise<T>
}
