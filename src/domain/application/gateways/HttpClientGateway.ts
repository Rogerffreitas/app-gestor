import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
export interface HttpClientGateway {
    getAllRecordsByHttpRequest: <T>(request: HttpRequest) => Promise<T[]>
    getRecordsByHttpRequest: <T>(request: HttpRequest) => Promise<T>
    httpRequestPost: <T>(request: HttpRequest) => Promise<T>
    httpRequesUpdate: <T>(request: HttpRequest) => Promise<T>
}
