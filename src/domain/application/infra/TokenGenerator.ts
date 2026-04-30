export interface TokenGenerator {
    accessTokenGenerator(payload: any): Promise<{ accessToken: { token: string; type: string } }>
}
