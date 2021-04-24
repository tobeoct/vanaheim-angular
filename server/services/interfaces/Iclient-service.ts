import { Client } from "@models/client";
import { IBaseService } from "./Ibaseservice";

export interface IClientService extends IBaseService<Client>{
    getClientDetails : (clientApiKey:any)=>Promise<Client>;
  

}
