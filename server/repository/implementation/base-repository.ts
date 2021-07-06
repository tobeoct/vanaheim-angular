import { BaseEntity } from "@models/base-entity";
import { IBaseRepository } from "@repository/interface/Ibase-repository";

 export class BaseRepository<T> implements IBaseRepository<T>{
   constructor(protected _db:any){
   }
 
   update= (data: BaseEntity) => {
    return new Promise<T>(async (resolve, reject) =>{
      let response = await this._db
      .update(
        {...data},
        { where: { id: data.id } }
      );
      // let dataValues = response?.dataValues as T;
    resolve(response)
    });
  }
   create= (data:  BaseEntity) => {
    return new Promise<T>(async (resolve, reject) =>{
      try{
      let response = await this._db
        .create(data)
        let dataValues = response?.dataValues as T;
        console.log("INSERTED COMPANY",dataValues)
      resolve(dataValues)
      }catch(err){
        console.log(err)
        reject(err)
      }
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
          resolve(await this._db.findByPk(id));
        });
      }
      getByIdWithInclude=(id:number, include?:any[])=>{
        return new Promise<any>(async (resolve, reject) =>{
         
          resolve(await this._db.findByPk(id,{include}));
          
        });
      }
    search=(parameters:object,pageNumber:number,maxSize:number,orderBy:any[]=[["updatedAt","DESC"]],include?:any[])=>{
        return new Promise<any>(async(resolve, reject) =>{
          let params:any ={
            limit: maxSize,
            offset: pageNumber * maxSize,
            where: {...parameters}, // conditions
            order:orderBy
          };
          if(include){
            params["include"] = include;
          }
         resolve(await this._db.findAndCountAll(params));

        });
      }
}