import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
import UserDto from '../../entity/user/UserDto'

export interface UserServices {
    getAllRecordsByHttpRequest: (request: HttpRequest, userRule: string) => Promise<UserDto[]>
}
