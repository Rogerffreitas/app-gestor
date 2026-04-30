export class EnterpriseDto {
    serverId: number | null
    id: string
    name: string
    companyName: string
    street: string | null
    number: string | null
    neighborhood: string | null
    city: string | null
    uf: string | null
    cep: string | null
    complement: string | null
    cel: string | null
    tel: string | null
    email: string | null
    cnpj: string | null
    stateRegistration: string | null
    createdAt: bigint | null
    updatedAt: bigint | null

    constructor(data: Pick<EnterpriseDto, 'id' | 'name' | 'companyName'> & Partial<EnterpriseDto>) {
        Object.assign(this, data)
    }
}
