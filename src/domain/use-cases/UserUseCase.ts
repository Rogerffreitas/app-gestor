import UserDto from '../entity/user/UserDto'

export interface UserUseCase {
    loginByUsernameAndPassword: (
        username: string,
        password: string,
    ) => Promise<{ accessToken: { token: string; type: string } }>
    signUp: (user: UserDto) => Promise<UserDto>
    loadAllUsersByEnterpriseId: (enterpriseId: string, userRole: string) => Promise<UserDto[]>
}
