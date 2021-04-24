import { IBaseRepository } from "@repository/interface/Ibase-repository";

 export class BaseRepository<T> implements IBaseRepository<T>{
   constructor(){

   }
   update= (data: T) => {
    return new Promise<T>((resolve, reject) =>{});
  }
   create= (data: T) => {
    return new Promise<T>((resolve, reject) =>{});
  }
   delete= (id: number) => {
    return new Promise<T>((resolve, reject) =>{});
  }
     getAll=()=>{
        return new Promise<T[]>((resolve, reject) =>{});
      }
      getById=()=>{
        return new Promise<T>((resolve, reject) =>{});
      }
    search=(parameters:object,pageNumber:number,maxSize:number)=>{
        return new Promise<T>((resolve, reject) =>{});
      }
}