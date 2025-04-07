import { FileType } from "./FileType";

export type FolderType = {
    id: number;
    name: string;
    createdBy: number;
    parentId: number | null;
    files: FileType[];//???
    createdAt: Date 
    updatedAt: Date
}
