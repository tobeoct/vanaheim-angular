import { BaseEntity } from "@models/base-entity";
import { IBaseRepository } from "@repository/interface/Ibase-repository";

 export class BaseRepository<T> implements IBaseRepository<T>{
   constructor(protected _db:any){
      // console.log(_db)
   }
 
   update= (data: BaseEntity) => {
    return new Promise<T>(async (resolve, reject) =>{
      resolve(await this._db
        .update(
          {...data},
          { where: { id: data.id } }
        ))
    });
  }
   create= (data:  BaseEntity) => {
    return new Promise<T>(async (resolve, reject) =>{
      resolve(await this._db
        .create(data))

    });
  }
   delete= (id: number) => {
    return new Promise<T>((resolve, reject) =>{});
  }
     getAll=()=>{
        return new Promise<T[]>((resolve, reject) =>{
          
          resolve(this._db
          .findAll())

        });
      }
      getById=(id:number)=>{
        return new Promise<any>(async (resolve, reject) =>{
          console.log("MyDB",this._db)
          resolve(await this._db.findByPk(id));
        });
      }
    search=(parameters:object,pageNumber:number,maxSize:number)=>{
        return new Promise<T>((resolve, reject) =>{});
      }
}