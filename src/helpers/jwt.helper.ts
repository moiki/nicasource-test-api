import jwt from 'jsonwebtoken';
import environmentCommon from "../common/enviroment.common";
export function GenerateToken(data: any) {
    const token = jwt.sign({
        _id: data.id.toString(),
        name: data.username,
        email: data.email,
        session: data.session
    }, environmentCommon.secret_key, {
        expiresIn: environmentCommon.expiration_token,
    });

    return {token: token};
}