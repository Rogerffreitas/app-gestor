import UserEntity from "../entity/UserEntity"

interface Enterprise {
    name: string
}

interface Token {
    token: string
    type: string
}

export interface AuthHttpResponse {
    user: UserEntity
    enterprise: Enterprise
    token: Token
}