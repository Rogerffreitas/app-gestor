import { injectable, inject } from 'inversify'
import { HttpClientGateway } from '../../application/gateways/HttpClientGateway'
import { AuthHttpResponse } from '../../entity/http/dtos/AuthHttpResponse'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { AuthServices } from '../interfaces/AuthServices'
import { TYPES } from '../../../infra/ioc/types'

@injectable()
export class AuthServicesImpl implements AuthServices {
    constructor(@inject(TYPES.HttpClientGateway) private httpClient: HttpClientGateway) {}

    async loginByUsernameAndPassword(request: HttpRequest): Promise<AuthHttpResponse> {
        //console.log(request.baseURL + request.url)
        return await this.httpClient.httpRequestPost<AuthHttpResponse>(request)
    }
}
