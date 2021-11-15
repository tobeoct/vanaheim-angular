import { DBResponse } from "./db-response";

export type SearchResponse<T>={
    count:number,
    rows:DBResponse<T>[]
  }