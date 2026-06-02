import { EnterpriseRepositoryGateway } from '../../application/gateways/EnterpriseRepositoryGateway'
import { EnterpriseDto } from '../../entity/enterprise/EnterpriseDto'
import { EnterpriseInteractor } from '../EnterpriseInteractor'

// Mock do EnterpriseDto para interceptar a instanciação por construtor
jest.mock('../../entity/enterprise/EnterpriseDto', () => {
    return {
        __esModule: true,
        EnterpriseDto: jest.fn().mockImplementation((data) => {
            return { ...data, isDto: true }
        }),
    }
})

describe('EnterpriseInteractor', () => {
    let interactor: EnterpriseInteractor
    let mockRepository: jest.Mocked<EnterpriseRepositoryGateway>

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock do gateway do repositório
        mockRepository = {
            loadEnterpriseByID: jest.fn(),
        } as unknown as jest.Mocked<EnterpriseRepositoryGateway>

        interactor = new EnterpriseInteractor(mockRepository)
    })

    // =========================================================================
    // LOAD ENTERPRISE BY ID
    // =========================================================================
    describe('loadEnterpriseByID', () => {
        it('Should return the mapped EnterpriseDto when the enterprise is found in repository', async () => {
            // Arrange
            const mockEnterpriseRecord = {
                id: 'ent-001',
                name: 'Filial Russas',
                companyName: 'Russas Logística LTDA',
            } as EnterpriseDto
            mockRepository.loadEnterpriseByID.mockResolvedValueOnce(mockEnterpriseRecord)

            // Act
            const result = await interactor.loadEnterpriseByID('ent-001')

            // Assert
            expect(mockRepository.loadEnterpriseByID).toHaveBeenCalledWith('ent-001')
            expect(result).not.toBeNull()
            expect(result).toEqual({
                id: 'ent-001',
                name: 'Filial Russas',
                companyName: 'Russas Logística LTDA',
                isDto: true,
            })
        })

        it('Should return null when the repository does not find the enterprise', async () => {
            // Arrange
            mockRepository.loadEnterpriseByID.mockResolvedValueOnce(null)

            // Act
            const result = await interactor.loadEnterpriseByID('ent-non-existent')

            // Assert
            expect(mockRepository.loadEnterpriseByID).toHaveBeenCalledWith('ent-non-existent')
            expect(result).toBeNull()
        })
    })
})
