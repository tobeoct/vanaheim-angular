import { BaseEntity } from "@models/base-entity";

export interface IBaseRepository<T> {
    getAll: () => Promise<any[]>
    getById: (id: number) => Promise<any>
    getByIdWithInclude: (id: number, include?: any[]) => Promise<any>
    update: (data: BaseEntity) => Promise<T>
    create: (data: BaseEntity) => Promise<T>
    delete: (id: number) => Promise<T>
    search: (parameters: object, pageNumber: number, maxSize: number, orderBy?: any[], include?: any[]) => Promise<any>
}