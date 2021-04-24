 export interface IBaseRepository<T>{
    getAll: () => Promise<T[]>
    getById: (id:number) => Promise<T>
    update: (data:T) => Promise<T>
    create: (data:T) => Promise<T>
    delete: (id:number) => Promise<T>
    search:(parameters:object,pageNumber:number,maxSize:number)=> Promise<T>
}