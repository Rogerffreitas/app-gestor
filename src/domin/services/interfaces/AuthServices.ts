import { AuthHttpResponse } from '../../entity/http/dtos/AuthHttpResponse'
import { HttpRequest } from '../../entity/http/dtos/HttpRequest'

export default interface AuthServices {
    loginByUsernameAndPassword: (request: HttpRequest) => Promise<AuthHttpResponse>
}
