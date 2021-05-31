import { IBaseRepository } from "@repository/interface/Ibase-repository";
import { IBaseService } from "@services/interfaces/Ibaseservice";

export class BaseService<T> implements IBaseService<T>{
    constructor( protected _baseRepository:IBaseRepository<T>){

    }
    convertToModel: (modelInDb: any) => Promise<T>;
    enable: (id: number) => Promise<T>;
    disable: (id: number) => Promise<T>;
    getAll= () =>new Promise<T[]>((resolve, reject) =>{
        resolve(this._baseRepository.getAll());
    });
    getById= (id:number) =>new Promise<T>((resolve, reject) =>{
        let response:any =this._baseRepository.getById(id);
        if(response && Object.keys(response).length>0) response = response.dataValues as T
        resolve(response);
    });
    update: (data: T) => Promise<T>;
    create: (data: T) => Promise<T>;
    delete: (id: number) => Promise<T>;
}