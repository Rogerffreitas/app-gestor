import React, { createContext, useContext } from 'react'
import { ContainerTypes, container } from '../infra/ioc/dependencies'

const InjectionContext = createContext<ContainerTypes>(container)

export const InjectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <InjectionContext.Provider value={container}>{children}</InjectionContext.Provider>
}

export function useInjection<K extends keyof ContainerTypes>(identifier: K): ContainerTypes[K] {
    const context = useContext(InjectionContext)

    if (!context[identifier]) {
        throw new Error(`Dependency ${String(identifier)} not found in container.`)
    }

    return context[identifier]
}
