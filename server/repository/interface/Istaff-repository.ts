import { Staff } from "@entities/staff";
import { IBaseRepository } from "./Ibase-repository";

export interface IStaffRepository extends IBaseRepository<Staff>{
    getByUserID: (userID:number) => Promise<any>
}