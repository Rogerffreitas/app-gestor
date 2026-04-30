import { SyncPushResponse } from '../../interfaces/Sync'
import Token from '../../interfaces/Token'

export interface SyncAdapter {
    sync(token: Token, url: string, signOut: () => void): Promise<SyncPushResponse>
}
