import axios from 'axios'
import HttpClientGateway from '../../domin/application/gateways/HttpClientGateway'
import { HttpRequest } from '../../domin/entity/http/dtos/HttpRequest'

export class AxiosHttpClientAdapter<T> implements HttpClientGateway<T> {
    async httpRequestPost(request: HttpRequest): Promise<T> {
        try {
            const response = await axios.post<T>(request.baseURL + request.url, request.body, {
                timeout: 5000,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            if (response.status > 201) {
                console.log(response.status)
                throw new Error(response.statusText)
            }

            return response.data
        } catch (error) {
            throw new Error(error)
        }
    }
    async getAllRecordsByHttpRequest(request: HttpRequest): Promise<T[]> {
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
            console.log(error)
            throw new Error(error)
        }
    }
    async getRecordsByHttpRequest(request: HttpRequest): Promise<T> {
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
