import HttpClientGateway from '../../application/gateways/HttpClientGateway'
import UserEntity from '../../entity/user/UserEntity'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { UserServices } from '../interfaces/UserServices'

export class UserServicesImpl implements UserServices {
    private httpClientGateway: HttpClientGateway<UserEntity>

    constructor(httpClientGateway: HttpClientGateway<UserEntity>) {
        this.httpClientGateway = httpClientGateway
    }
    async getAllRecordsByHttpRequest(request: HttpRequest, userRule: string): Promise<UserEntity[]> {
        const response = await this.httpClientGateway.getAllRecordsByHttpRequest(request)
        if (userRule === 'ADMIN') {
            return response
        }
        return Promise.resolve([])
    }
}
