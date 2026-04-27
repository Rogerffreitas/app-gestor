import { HttpClientGateway } from '../../application/gateways/HttpClientGateway'
import UserEntity from '../../entity/user/UserEntity'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import { UserServices } from '../interfaces/UserServices'
import UserDto from '../../entity/user/UserDto'
import { UserRoles } from '../../../types'

export class UserServicesImpl implements UserServices {
    constructor(private httpClient: HttpClientGateway) {}

    async getAllRecordsByHttpRequest(request: HttpRequest, userRule: string): Promise<UserDto[]> {
        const result = await this.httpClient.getAllRecordsByHttpRequest<UserEntity>(request)
        if (userRule === UserRoles.ADMIN) {
            const dtos = result.map((item) => {
                return this.toDto(item)
            })
            return dtos
        }
        return Promise.resolve([])
    }

    private toDto(entity: UserEntity): UserDto {
        return {
            id: entity.id,
            name: entity.name,
            username: entity.username,
            email: entity.email,
            role: entity.role,
            enterpriseId: entity.enterpriseId,
        }
    }
}
