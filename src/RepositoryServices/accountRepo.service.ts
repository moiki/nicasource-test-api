import bcrypt from 'bcrypt';
import {IAccountRepository, ISignUpInput} from "../interfaces/IAccountRepository";
import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {GenerateToken} from "../helpers/jwt.helper";
import environmentCommon from "../common/enviroment.common";

export default class AccountRepoService implements IAccountRepository {
    private userManager: Repository<User>;

    constructor() {
        this.userManager = DataBaseConnection.getRepository(User);
    }

    async getSessionUser(email: string): Promise<any> {
        try {
            return await this.userManager.findBy({email});
        } catch (error) {
            console.log(error.message)
        }
    }

    async login(email: string, password: string): Promise<any> {
        const findUser = await this.userManager.findOne({where: {email}});
        if (!findUser) throw Error("Invalid Credentials: User not found!");
        const isMatch = bcrypt.compareSync(password, findUser.passwordHash);
        if (!isMatch) throw Error("Invalid Credentials: Password is not correct!");
        const getToken = GenerateToken(findUser);
        return {
            token: getToken.token,
            email: findUser.email
        };

    }

    async register(registerInput: ISignUpInput): Promise<boolean> {
        const findUser = await this.userManager.findOne({where: {email: registerInput.email}});
        if (findUser) throw Error("this user already Exists!")
        const hashed = await bcrypt.hash(registerInput.password, environmentCommon.salt_rounds);
        const user: any = {
            email: registerInput.email,
            firstName: registerInput.firstName,
            lastName: registerInput.lastName,
            passwordHash: hashed,
        }
        await this.userManager.save(user);
        return true;
    }

}