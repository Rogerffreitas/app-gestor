import Token from '../../interfaces/Token'

export interface SyncServices {
    sync(token: Token, url: string, signOut: () => void): Promise<void>
    subscribe(listener: (status: string, isSyncing: boolean) => void)
    getStatus(): string
    getIsSyncing(): boolean
}
