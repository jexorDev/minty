import BaseService from "./BaseService";
import type ImportedFile from "@/data/interfaces/ImportedFile";

export default class ImportedFileService extends BaseService<ImportedFile> {
    constructor() {
        super("importedFiles");
    }
}