import Token from '../../../interfaces/Token'
import { SyncAdapter } from '../../application/infra/SyncAdapter'
import { SyncServices } from '../interfaces/SyncService'

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success'

export class SyncServicesImpl implements SyncServices {
    constructor(private adapter: SyncAdapter) {}

    private _isSyncing = false
    private _status: SyncStatus = 'idle'
    private _listeners: ((status: SyncStatus, isSyncing: boolean) => void)[] = []
    private _resetTimer: NodeJS.Timeout | null = null

    getIsSyncing() {
        return this._isSyncing
    }
    getStatus() {
        return this._status
    }

    subscribe(listener: (status: SyncStatus, isSyncing: boolean) => void) {
        this._listeners.push(listener)
        return () => {
            this._listeners = this._listeners.filter((l) => l !== listener)
        }
    }

    private notify() {
        this._listeners.forEach((l) => l(this._status, this._isSyncing))
    }

    async sync(token: Token, url: string, signOut: () => void): Promise<void> {
        if (this._isSyncing) return

        if (this._resetTimer) {
            clearTimeout(this._resetTimer)
            this._resetTimer = null
        }

        this._isSyncing = true
        this._status = 'syncing'
        this.notify()

        try {
            await this.adapter.sync(token, url, signOut)

            this._status = 'success'
            console.log('Sync completed successfully')
        } catch (error) {
            this._status = 'error'
            throw error
        } finally {
            this._isSyncing = false
            this._status = 'idle'
            this.notify()
        }
    }
}
