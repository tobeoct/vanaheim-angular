import { IBaseService } from "@services/interfaces/Ibaseservice";

export class BaseService<T> implements IBaseService<T>{
    constructor(private _db:any){

    }
    enable: (id: number) => Promise<T>;
    disable: (id: number) => Promise<T>;
    getAll: () => Promise<T[]>;
    getById: (id: number) => Promise<T>;
    update: (data: T) => Promise<T>;
    create: (data: T) => Promise<T>;
    delete: (id: number) => Promise<T>;
}