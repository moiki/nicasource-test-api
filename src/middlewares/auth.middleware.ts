import {Middleware} from "@decorators/express";
import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import environmentCommon from "../common/enviroment.common";
const contextService = require('request-context');
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
            (request as CustomRequest).token = decoded;
            (request as CustomRequest).user = JSON.parse(JSON.stringify(decoded));
            contextService.set('req:userInfo', JSON.parse(JSON.stringify(decoded)));
            next();
        } catch (err) {
            console.log(err.message)
            response.status(401).send({message:'Please authenticate'});
        }
    }
}