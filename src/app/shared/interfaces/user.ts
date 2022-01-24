import { UserCategory } from "@enums/usercategory";
import { LoginType } from "@enums/logintype";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    category:UserCategory;
    type:LoginType;
    authdata?: string;
}
