import bcrypt from 'bcrypt';
import {IAccountRepository, ISignUpInput} from "../interfaces/IAccountRepository";
import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {GenerateToken} from "../helpers/jwt.helper";
import environmentCommon from "../common/enviroment.common";
import ErrorREST, {Errors} from "../helpers/error.helper";
import {Session} from "../entities/session.entity";

export default class AccountRepoService implements IAccountRepository {
    private userManager: Repository<User>;
    private sessionManager: Repository<Session>;

    constructor() {
        this.userManager = DataBaseConnection.getRepository(User);
        this.sessionManager = DataBaseConnection.getRepository(Session);
    }

    async getSessionUser(email: string): Promise<any> {
        return this.userManager.findOne({
            where: {email},
            relations: {tasks: true},
            select: {
                email: true,
                firstName: true,
                lastName: true,
                id: true
            }
        }).then(user => user)
            .catch(err => {
                throw new ErrorREST(Errors.ServerError, err?.message || err)
            });
    }

    async login(email: string, password: string): Promise<any> {
        const findUser = await this.userManager.findOne({where: {email}});
        if (!findUser) throw new ErrorREST(Errors.Aborted, "Invalid Credentials: User not found!");
        const isMatch = bcrypt.compareSync(password, findUser.passwordHash);
        if (!isMatch) throw new ErrorREST(Errors.Unauthorized, "Invalid Credentials: Password is not correct!");
        const newSession = await this.sessionManager.save({
            user: findUser
        })
        const getToken = GenerateToken({...findUser, session: newSession.sessionToken});
        return {
            token: getToken.token,
        };
    }

    async logout(email: string, session: string): Promise<boolean> {
        const result = await this.sessionManager.update({sessionToken: session}, {
            isActive: false,
            endSession: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        return !!result.affected;
    }

    async signup(registerInput: ISignUpInput): Promise<boolean> {
        const findUser = await this.userManager.findOne({where: {email: registerInput.email}});
        if (findUser) throw new ErrorREST(Errors.Aborted, "this user already Exists!")
        const hashed = await bcrypt.hash(registerInput.password, environmentCommon.salt_rounds);
        const user: any = {
            email: registerInput.email,
            firstName: registerInput.firstName,
            lastName: registerInput.lastName,
            passwordHash: hashed,
        }
        return this.userManager.save(user).then(_ => true)
            .catch(err => {
                throw new ErrorREST(Errors.ServerError, err?.message || err)
            });
    }

}