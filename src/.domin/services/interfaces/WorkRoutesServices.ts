import { ChangeErrorFields } from '../../../types'
import WorkRoutesDto from '../../entity/work-routes/WorkRoutesDto'

export interface WorkRoutesServices {
    /**
     * Create an entity in the database
     * @param dto data
     * @param changeErrorFields function to change error message fields
     */
    createWorkRoutesInLocalDatabase: (
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ) => Promise<WorkRoutesDto>

    /**
     * Update an entity in the database
     * @param dto data
     * @param changeErrorFields function to change error message fields
     */
    updateWorkRoutesInLocalDatabase: (
        dto: WorkRoutesDto,
        changeErrorFields: ChangeErrorFields
    ) => Promise<WorkRoutesDto>

    /**
     * Delete an entity in the database
     * @param id entity id
     * @param userId user who requested the deletion of the entity from the database
     */
    deleteWorkRoutesInLocalDatabase: (id: string, userId: string) => Promise<void>

    findWorkRoutesByIdInLocalDatabase: (id: string) => Promise<WorkRoutesDto | null>

    /**
     * @param entitys work entitys
     */
    saveWorkRoutesServerId(entitys: WorkRoutesDto[]): void

    /**
     * Search all routes by company and work
     * @param enterpriseId enterprise entity id
     * @param workId work entity id
     */
    loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]>

    /**
     * Search all routes by company and work with valid serverId
     * @param enterpriseId enterprise entity id
     * @param workId work entity id
     */
    loadAllWorkRoutesByEnterpriseIdAndServeridValidFromLocalDatabase(
        enterpriseId: string,
        workId: string
    ): Promise<WorkRoutesDto[]>
}
