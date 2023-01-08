export  interface ISignUpInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string
}
export interface IAccountRepository {
    login(email:string, password: string): Promise<boolean>;
    register(registerInput: ISignUpInput): Promise<boolean>;
    getSessionUser(email: string): Promise<any>;
}