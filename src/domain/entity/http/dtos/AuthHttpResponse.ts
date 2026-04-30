import UserDto from '../../user/UserDto'

interface Enterprise {
    name: string
}

interface Token {
    token: string
    type: string
}

export interface AuthHttpResponse {
    accessToken: Token
}
