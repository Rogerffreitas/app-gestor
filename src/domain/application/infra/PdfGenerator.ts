export interface PdfGenerator {
    sendPDFBase64(
        body: any[],
        footer: any[],
        style: any,
        title: string,
        orientation: 'portrait' | 'landscape'
    ): Promise<string>
    sendPDFBuffer(
        body: any[],
        footer: any[],
        style: any,
        title: string,
        orientation: 'portrait' | 'landscape'
    ): Promise<Buffer>
}
