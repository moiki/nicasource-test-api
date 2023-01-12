import {Middleware} from "@decorators/express";
import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import environmentCommon from "../common/enviroment.common";
import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";
import {Session} from "../entities/session.entity";

export const SECRET_KEY: Secret = environmentCommon.secret_key;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user: any
}

export default class AuthMiddleware implements Middleware {
    async use(request: Request, response: Response, next: NextFunction) {
        try {
            const token = request.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error();
            }
            const decoded = jwt.verify(token, SECRET_KEY);
            const payload = JSON.parse(JSON.stringify(decoded));
            const verify = await DataBaseConnection.getRepository(Session)
                .findOne({where: {sessionToken: payload.session, isActive: true, user: {email: payload.email}}});
            if (!verify) {
                response.status(401).send({message: 'Unauthorized by expired session.'});
                return;
            }
            (request as CustomRequest).token = decoded;
            (request as CustomRequest).user = payload;
            // contextService.set('req:userInfo', JSON.parse(JSON.stringify(decoded)));
            next();
        } catch (err) {
            console.log(err.message)
            response.status(401).send({message: 'Unauthorized!'});
        }
    }
}