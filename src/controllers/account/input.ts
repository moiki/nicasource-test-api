import {ISignUpInput} from "../../interfaces/IAccountRepository";
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {Match} from "../../helpers/passwordValidator.helper";

export class RegisterInput {
    @IsEmail()
    email: string;
    @IsNotEmpty({message: "First name is required"})
    firstName: string;
    @IsNotEmpty({message: "Last name is required"})
    lastName: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match("password", {message: "The confirm password doesn't match"})
    confirmPassword: string;

}

export class LoginInput {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}