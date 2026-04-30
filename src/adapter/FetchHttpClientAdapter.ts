import { HttpClientGateway } from '@gestor/domain/application/gateways/HttpClientGateway'
import { HttpRequest } from '@gestor/domain/entity/http/dtos/HttpRequest'

export class FetchHttpClientAdapter implements HttpClientGateway {
    async httpRequesUpdate<T>(request: HttpRequest): Promise<T> {
        console.info('put')
        try {
            // 1. Configuração da URL e Query Params
            const url = new URL(request.baseURL + request.url)
            if (request.params) {
                Object.keys(request.params).forEach((key) =>
                    url.searchParams.append(key, String(request.params![key]))
                )
            }

            // 2. AbortController para Timeout de 5000ms
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(url.toString(), {
                method: 'PUT', // Método alterado para PUT
                signal: controller.signal,
                body: JSON.stringify(request.body), // Serialização manual do corpo
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            clearTimeout(timeoutId)

            // 3. Validação de status (seguindo sua lógica de status > 201)
            if (!response.ok) {
                console.info(response)
                throw new Error(response.statusText)
            }

            // 4. Retorno dos dados processados
            return (await response.json()) as T
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('Timeout: A atualização demorou mais de 5 segundos.')
            }
            console.info(error)
            throw new Error(error.message || error)
        }
    }

    async getAllRecordsByHttpRequest<T>(request: HttpRequest): Promise<T[]> {
        console.info('get all')
        try {
            // 1. Tratamento da URL e Query Params
            const url = new URL(request.baseURL + request.url)
            if (request.params) {
                Object.keys(request.params).forEach((key) =>
                    url.searchParams.append(key, String(request.params![key]))
                )
            }

            // 2. Configuração de Timeout (5 segundos)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(url.toString(), {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            // Limpa o timeout se a requisição responder a tempo
            clearTimeout(timeoutId)

            // 3. Verificação de Status (Fetch não lança erro em 4xx/5xx)
            if (!response.ok) {
                console.error(`Status Error: ${response.status}`)
                throw new Error(response.statusText)
            }

            // 4. Conversão para JSON
            const data = await response.json()
            return data as T[]
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('A requisição excedeu o tempo limite (Timeout)')
            }
            console.info(error)
            throw new Error(error.message || error)
        }
    }
    async getRecordsByHttpRequest<T>(request: HttpRequest): Promise<T> {
        console.info('get on')
        try {
            // 1. Construção da URL com searchParams
            const url = new URL(request.baseURL + request.url)
            if (request.params) {
                Object.keys(request.params).forEach((key) =>
                    url.searchParams.append(key, String(request.params![key]))
                )
            }

            // 2. Controle de Abort (Timeout)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(url.toString(), {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            clearTimeout(timeoutId)

            // 3. Validação da resposta
            if (!response.ok) {
                // No Fetch, é bom logar o status para depuração, já que ele não "quebra" sozinho
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`)
            }

            // 4. Parse do JSON e retorno
            return (await response.json()) as T
        } catch (error: any) {
            // Tratamento específico para erro de timeout
            if (error.name === 'AbortError') {
                throw new Error('A requisição expirou após 5000ms')
            }

            // Mantém o comportamento original de relançar o erro
            throw new Error(error.message || error)
        }
    }

    async httpRequestPost<T>(request: HttpRequest): Promise<T> {
        console.info('post')
        try {
            const url = new URL(request.baseURL + request.url)
            if (request.params) {
                Object.keys(request.params).forEach((key) =>
                    url.searchParams.append(key, request.params![key])
                )
            }

            // Configuração do AbortController para simular o timeout de 5000ms
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(url.toString(), {
                method: 'POST',
                signal: controller.signal,
                body: JSON.stringify(request.body),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    ...request.headers,
                    ...(request.token ? { Authorization: `Bearer ${request.token.token}` } : {}),
                },
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }

            // Diferente do Axios, precisamos extrair o JSON manualmente
            return (await response.json()) as T
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('Request timed out')
            }
            throw new Error(error.message || error)
        }
    }
}
