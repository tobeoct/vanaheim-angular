export interface IBaseService<T>{
    getAll: () => Promise<T[]>
    getById: (id:number) => Promise<T>
    update: (data:T) => Promise<T>
    create: (data:T) => Promise<T>
    delete: (id:number) => Promise<T>
  enable:(id:number)=>Promise<T>
  disable:(id:number)=>Promise<T>
}
