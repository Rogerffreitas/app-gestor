import { container } from '../ioc/container'
import { TYPES } from '../ioc/types'

export function useInjection<T>(identifier: keyof typeof TYPES): T {
    return container.get<T>(TYPES[identifier])
}
