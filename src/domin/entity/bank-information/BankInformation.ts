import { ChangeErrorFields } from '../../../types'

export class BankInformation {
    private _bank: string
    private _beneficiary: string
    private _agency: string
    private _account: string
    private _pix: string

    constructor(bank: string, beneficiary: string, agency: string, account: string, pix: string) {
        this._bank = bank
        this._beneficiary = beneficiary
        this._agency = agency
        this._account = account
        this._pix = pix
    }

    get bank(): string {
        return this._bank
    }

    get beneficiary(): string {
        return this._beneficiary
    }

    get agency(): string {
        return this._agency
    }

    get account(): string {
        return this._account
    }

    get pix(): string {
        return this._pix
    }

    /**
     * Valida todos os atributos da classe e retorna uma lista de erros formatado.
     * @returns Uma lista (Errors) contendo os erros, ou uma lista vazio se for válido.
     */
    public validate(changeErrorFields: ChangeErrorFields): string[] {
        const errors: string[] = []

        if (!this._bank || this._bank.trim() === '') {
            errors.push('O nome/código do banco é obrigatório.')
            changeErrorFields('bank')('O nome/código do banco é obrigatório.')
        }

        if (!this._beneficiary || this._beneficiary.trim() === '') {
            errors.push('O nome do beneficiário é obrigatório.')
            changeErrorFields('beneficiary')('O nome do beneficiário é obrigatório.')
        }

        // Função auxiliar para verificar se a string contém apenas dígitos (após limpeza)
        const digitsOnly = (str: string): boolean => /^\d+$/.test(str.replace(/\D/g, ''))

        const isAgencyValid =
            !!this._agency && digitsOnly(this._agency) && this._agency.replace(/\D/g, '').length >= 3
        const isContValid =
            !!this._account && digitsOnly(this._account) && this._account.replace(/\D/g, '').length >= 4

        const isBankInfoComplete = isAgencyValid && isContValid
        const isPixProvided = !!this._pix && this._pix.trim() !== ''

        // Se a conta e agência não estiverem preenchidas, mas o Pix também não estiver,
        // disparamos o erro de conta
        if (!isBankInfoComplete && !isPixProvided) {
            if (!!this._agency && !isAgencyValid) {
                errors.push('Agência inválida (deve conter apenas números e ter pelo menos 3 dígitos).')
                changeErrorFields('agency')('Agência inválida.')
            }
            if (!!this._account && !isContValid) {
                errors.push('Conta inválida (deve conter apenas números e ter pelo menos 4 dígitos).')
                changeErrorFields('account')('Conta inválida.')
            }
        }

        if (isPixProvided && this._pix.trim().length < 9) {
            errors.push('A chave Pix é inválida.')
            changeErrorFields('pix')('A chave Pix é inválida.')
        }

        return errors
    }
}
