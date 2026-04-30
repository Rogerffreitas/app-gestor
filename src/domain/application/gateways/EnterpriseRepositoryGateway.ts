import { EnterpriseEntity } from '../../entity/enterprise/EnterpriseEntity'

export interface EnterpriseRepositoryGateway {
    loadEnterpriseByID(id: string): Promise<EnterpriseEntity | null>
}
