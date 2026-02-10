import { ChangeErrorFields, ErrorMessages } from '../../../types'

export default class Proprietary {
    private _name: string
    private _cpfCnpj: string
    private _tel: string

    constructor(name: string, cpfCnpj: string, tel: string) {
        this._name = name
        this._cpfCnpj = cpfCnpj
        this._tel = tel
    }

    get name(): string {
        return this._name
    }

    get cpfCnpj(): string {
        return this._cpfCnpj
    }

    get tel(): string {
        return this._tel
    }

    /**
     * Valida todos os atributos da classe e retorna uma lista de erros formatado.
     * @returns Uma lista (Errors) contendo os erros, ou uma lista vazio se for válido.
     */
    public validate(changeErrorFields: ChangeErrorFields): ErrorMessages[] {
        let errorMessages: ErrorMessages[] = []

        // Regex para verificar se a string contém apenas dígitos (após remover formatação comum)
        const digitsOnly = (str: string): boolean => /^\d+$/.test(str)

        if (!this._name || this._name.trim() === '') {
            errorMessages.push({ field: 'proprietaryName', message: 'nome é obrigatório.' })
            changeErrorFields('proprietaryName')('Obrigatório.')
        }

        if (!this._cpfCnpj || this._cpfCnpj.trim() === '') {
            errorMessages.push({ field: 'cpfCnpj', message: 'O CPF/CNPJ é obrigatório.' })
            changeErrorFields('cpfCnpj')('Obrigatório.')
        } else {
            // Remove caracteres comuns de formatação (., -, /) para checar se é numérico
            const cleanCpfCnpj = this._cpfCnpj.replace(/[.\-/]/g, '')

            if (!digitsOnly(cleanCpfCnpj)) {
                errorMessages.push({ field: 'cpfCnpj', message: 'O CPF/CNPJ deve conter apenas números.' })
                changeErrorFields('cpfCnpj')('O CPF/CNPJ deve conter apenas números.')
            } else if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
                errorMessages.push({
                    field: 'cpfCnpj',
                    message: 'O CPF deve ter 11 dígitos e o CNPJ 14 dígitos.',
                })
                changeErrorFields('cpfCnpj')('O CPF deve ter 11 dígitos e o CNPJ 14 dígitos.')
            }
        }

        if (!this._tel || this._tel.trim() === '') {
            errorMessages.push({ field: 'tel', message: 'O telefone é obrigatório.' })
            changeErrorFields('tel')('Obrigatório.')
        } else {
            // Remove caracteres comuns de formatação (espaços, hífens, parênteses)
            const cleanTel = this._tel.replace(/[\s\-\(\)]/g, '')

            if (!digitsOnly(cleanTel) || cleanTel.length < 9) {
                errorMessages.push({ field: 'tel', message: 'O telefone é inválido ou muito curto.' })
                changeErrorFields('tel')('Inválido.')
            }
        }

        return errorMessages
    }
}
