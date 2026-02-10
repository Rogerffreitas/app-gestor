import UserEntity from '../../entity/user/UserEntity'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'

export interface UserServices {
    getAllRecordsByHttpRequest: (request: HttpRequest, userRule: string) => Promise<UserEntity[]>
}
