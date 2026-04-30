import { EnterpriseDto } from '../entity/enterprise/EnterpriseDto'

export interface EnterpriseUseCase {
    loadEnterpriseByID(id: string): Promise<EnterpriseDto | null>
}
