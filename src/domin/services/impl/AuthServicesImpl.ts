import { injectable, inject } from 'inversify'
import { HttpClientGateway } from '../../application/gateways/HttpClientGateway'
import { AuthHttpResponse } from '../../entity/http/dtos/AuthHttpResponse'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { AuthServices } from '../interfaces/AuthServices'

export class AuthServicesImpl implements AuthServices {
    private httpClient: HttpClientGateway
    constructor(httpClient: HttpClientGateway) {
        this.httpClient = httpClient
    }

    async loginByUsernameAndPassword(request: HttpRequest): Promise<AuthHttpResponse> {
        //console.log(request.baseURL + request.url)
        return await this.httpClient.httpRequestPost<AuthHttpResponse>(request)
    }
}
