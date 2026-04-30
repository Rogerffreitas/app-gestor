export interface Encrypter {
    /**
     * @param password The data to be encrypted.
     * @param saltOrRounds The salt to be used in encryption. If specified as a number then a
     * salt will be generated with the specified number of rounds and used.
     * */
    encryptPassword(password: string, saltOrRounds: number): Promise<string>
    comparePasswords(data: string, encrypted: string): Promise<boolean>
}
