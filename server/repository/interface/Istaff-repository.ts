import { Staff } from "@models/staff";
import { IBaseRepository } from "./Ibase-repository";

export interface IStaffRepository extends IBaseRepository<Staff>{
    getByUserID: (userID:number) => Promise<any>
}