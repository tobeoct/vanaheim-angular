
import { IClientRepository } from "@repository/interface/Iclient-repository";
import { Client } from "@entities/client";
import { BaseRepository } from "./base-repository";

export class ClientRepository extends BaseRepository<Client> implements IClientRepository{
  constructor( _db:any){
    super(_db.Client)
  }
  
}