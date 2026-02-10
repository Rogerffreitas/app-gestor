import { HttpRequest } from '../../entity/http/dtos/HttpRequest'
export default interface HttpClientGateway<T> {
    getAllRecordsByHttpRequest: (request: HttpRequest) => Promise<T[]>
    getRecordsByHttpRequest: (request: HttpRequest) => Promise<T>
    httpRequestPost: (request: HttpRequest) => Promise<T>
}
