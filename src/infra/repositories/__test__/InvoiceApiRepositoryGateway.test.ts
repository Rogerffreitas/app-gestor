import { HttpClientGateway } from '@/src/domain/application/gateways/HttpClientGateway'
import { InvoiceApiRepositoryGateway } from '../InvoiceApiRepositoryGateway'
import Token from '@/src/interfaces/Token'
import { InvoiceEntity } from '../../../../src/domain/entity/invoice/InvoiceEntity'

jest.mock('../../../../src/domain/entity/invoice/InvoiceDto', () => ({
    InvoiceDto: jest.fn().mockImplementation(() => ({
        entityToDto: jest.fn().mockReturnValue({ id: 'mocked-dto-id', value: 1500 }),
    })),
}))

jest.mock('../../../../src/domain/entity/invoice/InvoiceEntity', () => ({
    InvoiceEntity: jest.fn().mockImplementation(() => ({
        dtoToEntity: jest.fn().mockReturnValue({ id: 'mocked-entity-id', value: 1500 }),
    })),
}))

describe('InvoiceApiRepositoryGateway', () => {
    let repository: InvoiceApiRepositoryGateway
    let mockHttpClient: jest.Mocked<HttpClientGateway>

    const baseURL = 'https://api.exemplo.com'
    const url = '/v1/invoices'
    const token = 'mocked-jwt-token' as unknown as Token
    const enterpriseId = 'ent-123'
    const workId = 'work-456'

    beforeEach(() => {
        // Inicializa o Mock do HttpClient com todos os métodos usados na classe
        mockHttpClient = {
            httpRequestPost: jest.fn(),
            getRecordsByHttpRequest: jest.fn(),
            getAllRecordsByHttpRequest: jest.fn(),
            httpRequesUpdate: jest.fn(), // Mantido exatamente com a grafia do seu código (sem o 't')
        } as unknown as jest.Mocked<HttpClientGateway>

        repository = new InvoiceApiRepositoryGateway(mockHttpClient)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    // =========================================================================
    // 1. PREVIEW INVOICE
    // =========================================================================
    describe('previewInvoice', () => {
        const mockEntity = {} as InvoiceEntity

        it('Should successfully request preview and return a string format response', async () => {
            mockHttpClient.httpRequestPost.mockResolvedValueOnce('pdf-base64-string-preview')

            const result = await repository.previewInvoice(baseURL, url, mockEntity, token)

            expect(result).toBe('pdf-base64-string-preview')
            expect(mockHttpClient.httpRequestPost).toHaveBeenCalledWith({
                baseURL,
                url,
                token,
                body: { invoice: { id: 'mocked-dto-id', value: 1500 } },
            })
        })

        it('Should log and throw custom error when httpRequestPost fails', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.httpRequestPost.mockRejectedValueOnce(new Error('Timeout'))

            await expect(repository.previewInvoice(baseURL, url, mockEntity, token)).rejects.toThrow(
                /\[InvoiceRepository\] An unexpected error occurred while trying to create an preview invoice\./
            )

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 2. GENERATE INVOICE ANALYTIC PDF FORMAT
    // =========================================================================
    describe('generateInvoiceAnalyticPdfFormat', () => {
        const invoiceId = 'inv-999'

        it('Should successfully fetch analytic PDF format string', async () => {
            mockHttpClient.getRecordsByHttpRequest.mockResolvedValueOnce('pdf-url-or-string')

            const result = await repository.generateInvoiceAnalyticPdfFormat(
                baseURL,
                url,
                token,
                invoiceId,
                enterpriseId,
                workId
            )

            expect(result).toBe('pdf-url-or-string')
            expect(mockHttpClient.getRecordsByHttpRequest).toHaveBeenCalledWith({
                baseURL,
                url: `${url}/${invoiceId}`,
                token,
                params: { enterpriseId, workId },
            })
        })

        it('Should log and throw custom error when API fails', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.getRecordsByHttpRequest.mockRejectedValueOnce(new Error('Network Error'))

            await expect(
                repository.generateInvoiceAnalyticPdfFormat(
                    baseURL,
                    url,
                    token,
                    invoiceId,
                    enterpriseId,
                    workId
                )
            ).rejects.toThrow(/\[InvoiceRepository\] An error occurred: Error: Network Error/)

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 3. LOAD A INVOICE BY ID (loadAInoviceById)
    // =========================================================================
    describe('loadAInoviceById', () => {
        const id = 'inv-unique-id'

        it('Should return InvoiceDto matching target ID', async () => {
            const mockDto = { id: 'inv-unique-id', items: [] }
            mockHttpClient.getRecordsByHttpRequest.mockResolvedValueOnce(mockDto)

            const result = await repository.loadAInoviceById(baseURL, url, id, enterpriseId, workId, token)

            expect(result).toEqual(mockDto)
            expect(mockHttpClient.getRecordsByHttpRequest).toHaveBeenCalledWith({
                baseURL,
                url: `${url}/${id}`,
                token,
                params: { enterpriseId, workId },
            })
        })

        it('Should log error and throw custom exception on retrieval failure', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.getRecordsByHttpRequest.mockRejectedValueOnce(new Error('404 Not Found'))

            await expect(
                repository.loadAInoviceById(baseURL, url, id, enterpriseId, workId, token)
            ).rejects.toThrow(/\[InvoiceRepository\] An error occurred while retrieving invoice items:/)

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 4. LOAD ALL INVOICES BY ENTERPRISE, WORK AND TYPE
    // =========================================================================
    describe('loadAllInoviceEnterpriseIdAndWorkIdAndType', () => {
        const type = 'ENTRADA'

        it('Should return an array of InvoiceDto matching filters', async () => {
            const mockList = [{ id: '1' }, { id: '2' }]
            mockHttpClient.getAllRecordsByHttpRequest.mockResolvedValueOnce(mockList)

            const result = await repository.loadAllInoviceEnterpriseIdAndWorkIdAndType(
                baseURL,
                url,
                enterpriseId,
                workId,
                type,
                token
            )

            expect(result).toEqual(mockList)
            expect(mockHttpClient.getAllRecordsByHttpRequest).toHaveBeenCalledWith({
                baseURL,
                url,
                token,
                params: { enterpriseId, workId, type },
            })
        })

        it('Should log and throw when global search fails', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.getAllRecordsByHttpRequest.mockRejectedValueOnce(new Error('Unauthorized'))

            await expect(
                repository.loadAllInoviceEnterpriseIdAndWorkIdAndType(
                    baseURL,
                    url,
                    enterpriseId,
                    workId,
                    type,
                    token
                )
            ).rejects.toThrow(/\[InvoiceRepository\] An error occurred while retrieving invoice items:/)

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 5. LOAD ALL INVOICE ITEMS BY FILTERS & DATES
    // =========================================================================
    describe('loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType', () => {
        const targetVehicleOrEquipmentId = 'vehicle-777'
        const startDate = 1716818400 // Timestamps
        const endDate = 1716904800
        const type = 'SAIDA'

        it('Should post data filters and successfully return back InvoiceDto items', async () => {
            const mockDtoResponse = { id: 'filtered-invoice-dto' }
            mockHttpClient.httpRequestPost.mockResolvedValueOnce(mockDtoResponse)

            const result = await repository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                targetVehicleOrEquipmentId,
                baseURL,
                url,
                enterpriseId,
                workId,
                startDate,
                endDate,
                type,
                token
            )

            expect(result).toEqual(mockDtoResponse)
            expect(mockHttpClient.httpRequestPost).toHaveBeenCalledWith({
                baseURL,
                url,
                token,
                body: {
                    transportVehicleOrWorkEquipmentId: targetVehicleOrEquipmentId,
                    enterpriseId,
                    workId,
                    startDate,
                    endDate,
                    type,
                },
            })
        })

        it('Should log error and throw on filtering POST failure', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.httpRequestPost.mockRejectedValueOnce(new Error('Bad Request'))

            await expect(
                repository.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                    targetVehicleOrEquipmentId,
                    baseURL,
                    url,
                    enterpriseId,
                    workId,
                    startDate,
                    endDate,
                    type,
                    token
                )
            ).rejects.toThrow(/\[InvoiceRepository\] An error occurred while retrieving invoice items:/)

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 6. GENERATE INVOICE
    // =========================================================================
    describe('generateInvoice', () => {
        const mockEntity = {} as InvoiceEntity

        it('Should map entity to DTO, execute post, and map response back to Entity', async () => {
            const mockDtoResponse = { id: 'new-invoice-from-server' }
            mockHttpClient.httpRequestPost.mockResolvedValueOnce(mockDtoResponse)

            const result = await repository.generateInvoice(baseURL, url, mockEntity, token)

            expect(result).toBeDefined()
            expect(result.id).toBe('mocked-entity-id') // ID vindo do Mock de InvoiceEntity().dtoToEntity()
            expect(mockHttpClient.httpRequestPost).toHaveBeenCalledWith({
                baseURL,
                url,
                token,
                body: { invoice: { id: 'mocked-dto-id', value: 1500 } },
            })
        })

        it('Should trigger catch block when request fails', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.httpRequestPost.mockRejectedValueOnce(new Error('Internal Server Error'))

            await expect(repository.generateInvoice(baseURL, url, mockEntity, token)).rejects.toThrow(
                /\[InvoiceRepository\] An unexpected error occurred while trying to create an invoice\./
            )

            expect(infoSpy).toHaveBeenCalled()
        })
    })

    // =========================================================================
    // 7. UPDATE INVOICE
    // =========================================================================
    describe('updateInvoice', () => {
        const mockEntity = {} as InvoiceEntity

        it('Should cleanly request httpRequesUpdate and map response back to entity', async () => {
            const mockDtoResponse = { id: 'updated-invoice' }
            mockHttpClient.httpRequesUpdate.mockResolvedValueOnce(mockDtoResponse)

            const result = await repository.updateInvoice(baseURL, url, mockEntity, token)

            expect(result).toBeDefined()
            expect(mockHttpClient.httpRequesUpdate).toHaveBeenCalledWith({
                baseURL,
                url,
                token,
                body: { invoice: { id: 'mocked-dto-id', value: 1500 } },
            })
        })

        it('Should log error and throw when update client fails', async () => {
            const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
            mockHttpClient.httpRequesUpdate.mockRejectedValueOnce(new Error('Gateway Timeout'))

            await expect(repository.updateInvoice(baseURL, url, mockEntity, token)).rejects.toThrow(
                /\[InvoiceRepository\] An unexpected error occurred while trying to update an invoice\./
            )

            expect(infoSpy).toHaveBeenCalled()
        })
    })
})
