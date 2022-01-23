import { BaseEntity } from "@entities/base-entity";

export interface IBaseRepository<T> {
    getAll: () => Promise<any[]>
    getById: (id: number) => Promise<any>
    getByIdWithInclude: (id: number, include?: any[]) => Promise<any>
    update: (data: BaseEntity) => Promise<T>
    create: (data: BaseEntity) => Promise<T>
    delete: (id: number) => Promise<any>
    batchDelete: (id: number[]) => Promise<any>
    search: (parameters: object, pageNumber: number, maxSize: number, orderBy?: any[], include?: any[]) => Promise<any>
}