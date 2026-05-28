import UserEntity from '../entity/user/UserEntity'
import { Encrypter } from '../application/infra/Encrypter'
import { TokenGenerator } from '../application/infra/TokenGenerator'
import { UserUseCase } from '../use-cases/UserUseCase'
import { UserRepositoryGateway } from '../application/gateways/UserRepositoryGateway'
import { EnterpriseRepositoryGateway } from '../application/gateways/EnterpriseRepositoryGateway'
import { UserRoles } from '../types'
import UserDto from '../entity/user/UserDto'

export class UserInteractor implements UserUseCase {
    private userRepository: UserRepositoryGateway
    private enterpriseRepository: EnterpriseRepositoryGateway
    private encrypter: Encrypter
    private tokenGenerator: TokenGenerator

    constructor(
        userRepository: UserRepositoryGateway,
        enterpriseRepository: EnterpriseRepositoryGateway,
        encrypter: Encrypter,
        tokenGenerator: TokenGenerator
    ) {
        this.userRepository = userRepository
        this.enterpriseRepository = enterpriseRepository
        this.encrypter = encrypter
        this.tokenGenerator = tokenGenerator
    }
    async loadAllUsersByEnterpriseId(enterpriseId: string, userRole: string): Promise<UserDto[]> {
        if (userRole != UserRoles.ADMIN) {
            throw new Error('invalid credentials')
        }
        const result = await this.userRepository.loadAllUsersByEnterpriseId(enterpriseId)
        let list = [] as UserDto[]
        if (result) {
            result.forEach((item) => {
                if (item.role != 'ADMIN') {
                    list.push(new UserDto().toDto(item))
                }
            })
        }
        return result.map((item) => {
            return new UserDto().toDto(item)
        })
    }
    async signUp(user: UserDto): Promise<UserDto> {
        const enterpriseAlreadyExists = await this.enterpriseRepository.loadEnterpriseByID(user.enterpriseId)
        if (!enterpriseAlreadyExists) {
            throw new Error('The Enterprise not registered')
        }

        const userAlreadyExists = await this.userRepository.loadByEmailOrUsername(user.email, user.username)
        if (userAlreadyExists) {
            throw new Error('The user is already registered.')
        }
        const passwordEncrypted = await this.encrypter.encryptPassword(user.password, 10)
        const entity = new UserEntity().toEntity(user, passwordEncrypted)
        return new UserDto().toDto(await this.userRepository.signup(entity))
    }
    async loginByUsernameAndPassword(
        username: string,
        password: string
    ): Promise<{ accessToken: { token: string; type: string } }> {
        const user = await this.userRepository.loginByUsername(username)
        if (!user) {
            throw new Error('invalid credentials')
        }

        if (!(await this.encrypter.comparePasswords(password, user.password))) {
            throw new Error('invalid credentials')
        }

        const enterprise = await this.enterpriseRepository.loadEnterpriseByID(user.enterpriseId)
        const token = await this.tokenGenerator.accessTokenGenerator({
            user: new UserDto().toDto(user),
            enterprise: {
                name: enterprise?.name,
            },
        })
        return token
    }
}
