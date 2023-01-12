import {validate} from "class-validator";
import ErrorREST, {Errors} from "./error.helper";

export default async function (validateObject: any)
{
    const validationErrors = await validate(validateObject, { forbidUnknownValues: false,validationError:true });
    if (validationErrors.length > 0) {
        const _errors = validationErrors.map(item => {
            const message = Object.entries(item?.constraints || {}).map(entry => entry[1]);
            return message.shift();
        })
        throw new ErrorREST(Errors.BadRequest, JSON.stringify(_errors))
    }
    return true;
}