import axios from 'axios'
import { HttpClientGateway } from '../domin/application/gateways/HttpClientGateway'
import { HttpRequest } from '../domin/entity/http/dtos/HttpRequest'
import { injectable } from 'inversify'

@injectable()
export class AxiosHttpClientAdapter implements HttpClientGateway {
    async httpRequesUpdate<T>(request: HttpRequest): Promise<T> {
        try {
            const response = await axios.put<T>(request.baseURL + request.url, request.body, {
                timeout: 5000,
                params: request.params ? request.params : {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            if (response.status > 201) {
                console.info(response)
                throw new Error(response.statusText)
            }
            return response.data
        } catch (error) {
            console.info(error)
            throw new Error(error)
        }
    }
    async httpRequestPost<T>(request: HttpRequest): Promise<T> {
        try {
            const response = await axios.post<T>(request.baseURL + request.url, request.body, {
                timeout: 5000,
                params: request.params ? request.params : {},
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            if (response.status > 201) {
                console.info(response)
                throw new Error(response.statusText)
            }
            return response.data
        } catch (error) {
            console.info(error)
            throw new Error(error)
        }
    }
    async getAllRecordsByHttpRequest<T>(request: HttpRequest): Promise<T[]> {
        try {
            const response = await axios.get<T[]>(
                request.baseURL + request.url,

                {
                    params: request.params,
                    timeout: 5000,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        ...request.headers,
                        ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                    },
                }
            )

            if (response.status != 200) {
                throw new Error(response.statusText)
            }
            return response.data
        } catch (error) {
            console.info(error)
            throw new Error(error)
        }
    }
    async getRecordsByHttpRequest<T>(request: HttpRequest): Promise<T> {
        try {
            const response = await axios.get<T>(
                request.baseURL + request.url,

                {
                    timeout: 5000,
                    params: request.params,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        ...request.headers,
                        ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                    },
                }
            )

            if (response.status != 200) {
                throw new Error(response.statusText)
            }

            return response.data
        } catch (error) {
            throw new Error(error)
        }
    }
}
