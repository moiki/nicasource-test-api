import {ISignUpInput} from "../../interfaces/IAccountRepository";
import {IsEmail, IsNotEmpty} from "class-validator";

export class RegisterInput implements ISignUpInput{
    @IsEmail()
    email: string;
    @IsNotEmpty({message: "First name is required"})
    firstName: string;
    @IsNotEmpty({message: "Last name is required"})
    lastName: string;
    password: string;

}