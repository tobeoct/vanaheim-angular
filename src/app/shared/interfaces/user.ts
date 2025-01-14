import { UserCategory } from "@enums/usercategory";
import { LoginType } from "@models/helpers/enums/logintype";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    category:UserCategory;
    type:LoginType;
    authdata?: string;
}
