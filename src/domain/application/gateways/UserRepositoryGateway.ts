import UserEntity from '../../entity/user/UserEntity'

export interface UserRepositoryGateway {
    loadByEmailOrUsername: (email: string, username: string) => Promise<UserEntity | null>
    loginByUsername: (username: string) => Promise<UserEntity | null>
    signup: (user: UserEntity) => Promise<UserEntity>
    loadAllUsersByEnterpriseId: (enterpriseId: string) => Promise<UserEntity[]>
}
