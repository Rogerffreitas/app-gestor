import { EnterpriseRepositoryGateway } from '../../application/gateways/EnterpriseRepositoryGateway'
import { UserRepositoryGateway } from '../../application/gateways/UserRepositoryGateway'
import { Encrypter } from '../../application/infra/Encrypter'
import { TokenGenerator } from '../../application/infra/TokenGenerator'
import { EnterpriseEntity } from '../../entity/enterprise/EnterpriseEntity'
import UserDto from '../../entity/user/UserDto'
import UserEntity from '../../entity/user/UserEntity'
import { UserDtoFactory } from '../../utils/factories/UserDtoFactory'
import { UserInteractor } from '../UserInteractor'

// Configuração do mock enxuto do DTO solicitado por você
jest.mock('../../entity/user/UserDto', () => {
    const MockUserDto = jest.fn().mockImplementation(() => ({
        toDto: jest.fn().mockImplementation((item) => (item ? { ...item, isDto: true } : null)),
    }))

    return {
        __esModule: true,
        default: MockUserDto,
        UserDto: MockUserDto,
    }
})

// Mock para o Enum/Objeto de Roles usado na validação do interactor
const UserRoles = {
    ADMIN: 'ADMIN',
    USER: 'USER',
}

// =========================================================================
// 🎯 INTERACTOR TEST SUITE
// =========================================================================
describe('UserInteractor', () => {
    let interactor: UserInteractor
    let mockUserRepository: jest.Mocked<UserRepositoryGateway>
    let mockEnterpriseRepository: jest.Mocked<EnterpriseRepositoryGateway>
    let mockEncrypter: jest.Mocked<Encrypter>
    let mockTokenGenerator: jest.Mocked<TokenGenerator>

    beforeEach(() => {
        jest.clearAllMocks()

        // Mocking dependencies
        mockUserRepository = {
            loadAllUsersByEnterpriseId: jest.fn().mockResolvedValue([]),
            loadByEmailOrUsername: jest.fn(),
            signup: jest.fn(),
            loginByUsername: jest.fn(),
        } as unknown as jest.Mocked<UserRepositoryGateway>

        mockEnterpriseRepository = {
            loadEnterpriseByID: jest.fn(),
        } as unknown as jest.Mocked<EnterpriseRepositoryGateway>

        mockEncrypter = {
            encryptPassword: jest.fn(),
            comparePasswords: jest.fn(),
        } as unknown as jest.Mocked<Encrypter>

        mockTokenGenerator = {
            accessTokenGenerator: jest.fn(),
        } as unknown as jest.Mocked<TokenGenerator>

        interactor = new UserInteractor(
            mockUserRepository,
            mockEnterpriseRepository,
            mockEncrypter,
            mockTokenGenerator
        )
    })

    // =========================================================================
    // LOAD ALL USERS BY ENTERPRISE ID
    // =========================================================================
    describe('loadAllUsersByEnterpriseId', () => {
        it('Happy Path: Should list all users when the requester role is ADMIN', async () => {
            const mockUsers = [
                { id: '1', username: 'user1', role: 'OPERATOR' } as UserEntity,
                { id: '2', username: 'user2', role: 'ADMIN' } as UserEntity,
            ] as UserEntity[]
            mockUserRepository.loadAllUsersByEnterpriseId.mockResolvedValueOnce(mockUsers)

            const result = await interactor.loadAllUsersByEnterpriseId('ent-123', UserRoles.ADMIN)

            expect(mockUserRepository.loadAllUsersByEnterpriseId).toHaveBeenCalledWith('ent-123')
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('isDto', true)
        })

        it('Unhappy Path: Should throw error if requester role is NOT ADMIN', async () => {
            await expect(interactor.loadAllUsersByEnterpriseId('ent-123', 'OPERATOR')).rejects.toThrow(
                'invalid credentials'
            )

            expect(mockUserRepository.loadAllUsersByEnterpriseId).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // SIGN UP
    // =========================================================================
    describe('signUp', () => {
        it('Happy Path: Should encrypt password and register user if enterprise exists and credentials are unique', async () => {
            const inputDto = UserDtoFactory.create({
                enterpriseId: 'ent-123',
                email: 'test@test.com',
                username: 'tester',
                password: 'plainPassword',
            })

            mockEnterpriseRepository.loadEnterpriseByID.mockResolvedValueOnce({
                id: 'ent-123',
                name: 'Enterprise Inc',
            } as EnterpriseEntity)
            mockUserRepository.loadByEmailOrUsername.mockResolvedValueOnce(null)
            mockEncrypter.encryptPassword.mockResolvedValueOnce('encryptedPassword123')
            mockUserRepository.signup.mockResolvedValueOnce({ id: 'user-777', username: 'tester' } as any)

            const result = await interactor.signUp(inputDto)

            expect(mockEnterpriseRepository.loadEnterpriseByID).toHaveBeenCalledWith('ent-123')
            expect(mockUserRepository.loadByEmailOrUsername).toHaveBeenCalledWith('test@test.com', 'tester')
            expect(mockEncrypter.encryptPassword).toHaveBeenCalledWith('plainPassword', 10)
            expect(mockUserRepository.signup).toHaveBeenCalledWith(expect.any(UserEntity))
            expect(result).toHaveProperty('isDto', true)
        })

        it('Unhappy Path: Should fail if the Enterprise is not registered', async () => {
            const inputDto = UserDtoFactory.create({ enterpriseId: 'invalid-ent' })
            mockEnterpriseRepository.loadEnterpriseByID.mockResolvedValueOnce(null)

            await expect(interactor.signUp(inputDto)).rejects.toThrow('The Enterprise not registered')
            expect(mockUserRepository.signup).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should fail if the user username or email already exists', async () => {
            const inputDto = UserDtoFactory.create({
                enterpriseId: 'ent-123',
                email: 'existing@test.com',
                username: 'existing',
            })

            mockEnterpriseRepository.loadEnterpriseByID.mockResolvedValueOnce({ id: 'ent-123' } as any)
            mockUserRepository.loadByEmailOrUsername.mockResolvedValueOnce({ id: 'old-user' } as any)

            await expect(interactor.signUp(inputDto)).rejects.toThrow('The user is already registered.')
            expect(mockEncrypter.encryptPassword).not.toHaveBeenCalled()
            expect(mockUserRepository.signup).not.toHaveBeenCalled()
        })
    })

    // =========================================================================
    // LOGIN BY USERNAME AND PASSWORD
    // =========================================================================
    describe('loginByUsernameAndPassword', () => {
        it('Happy Path: Should generate access token when username exists and password matches', async () => {
            const mockUser = {
                id: 'user-001',
                username: 'mario',
                password: 'hashedPassword',
                enterpriseId: 'ent-123',
            } as UserEntity
            const mockEnterprise = { id: 'ent-123', name: 'Mario Construction' } as EnterpriseEntity
            const expectedTokenResponse = { accessToken: { token: 'jwt-token-xyz', type: 'Bearer' } }

            mockUserRepository.loginByUsername.mockResolvedValueOnce(mockUser)
            mockEncrypter.comparePasswords.mockResolvedValueOnce(true)
            mockEnterpriseRepository.loadEnterpriseByID.mockResolvedValueOnce(mockEnterprise)
            mockTokenGenerator.accessTokenGenerator.mockResolvedValueOnce(expectedTokenResponse)

            const result = await interactor.loginByUsernameAndPassword('mario', 'secretPassword')

            expect(mockUserRepository.loginByUsername).toHaveBeenCalledWith('mario')
            expect(mockEncrypter.comparePasswords).toHaveBeenCalledWith('secretPassword', 'hashedPassword')
            expect(mockEnterpriseRepository.loadEnterpriseByID).toHaveBeenCalledWith('ent-123')
            expect(mockTokenGenerator.accessTokenGenerator).toHaveBeenCalledWith({
                user: expect.objectContaining({ isDto: true }),
                enterprise: { name: 'Mario Construction' },
            })
            expect(result).toEqual(expectedTokenResponse)
        })

        it('Unhappy Path: Should throw error if username is not found', async () => {
            mockUserRepository.loginByUsername.mockResolvedValueOnce(null)

            await expect(interactor.loginByUsernameAndPassword('ghostUser', 'password')).rejects.toThrow(
                'invalid credentials'
            )

            expect(mockEncrypter.comparePasswords).not.toHaveBeenCalled()
        })

        it('Unhappy Path: Should throw error if password verification fails', async () => {
            const mockUser = { id: 'user-001', username: 'mario', password: 'hashedPassword' } as UserEntity
            mockUserRepository.loginByUsername.mockResolvedValueOnce(mockUser)
            mockEncrypter.comparePasswords.mockResolvedValueOnce(false)

            await expect(interactor.loginByUsernameAndPassword('mario', 'wrongPassword')).rejects.toThrow(
                'invalid credentials'
            )

            expect(mockEnterpriseRepository.loadEnterpriseByID).not.toHaveBeenCalled()
        })
    })
})
