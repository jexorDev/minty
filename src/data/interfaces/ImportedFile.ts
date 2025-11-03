export default interface ImportedFile {
    pk: number;
    name: string;
    lineCount: number;
    maxTransactionDate: Date;
    minTransactionDate: Date;
    importDate: Date;
    fileType: number;
    status: number;
}