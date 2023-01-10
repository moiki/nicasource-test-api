import {ResponseInterface} from "./response.interface";

export  interface ISignUpInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string
}

export interface ILoginInput {
    email: string;
    password: string;
}
export interface IAccountRepository {
    login(email:string, password: string): Promise<any>;
    register(registerInput: ISignUpInput): Promise<boolean>;
    getSessionUser(email: string): Promise<any>;
}