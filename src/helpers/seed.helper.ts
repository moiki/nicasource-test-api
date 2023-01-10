import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";
import bcrypt from "bcrypt";
import environmentCommon from "../common/enviroment.common";

async function SeedUser() {
    try {
        const repo = DataBaseConnection.getRepository(User);
        const userExistence = await repo.count();
        console.log(userExistence);
        if (userExistence < 1) {
            const hashed = await bcrypt.hash("pa$$w0rd", environmentCommon.salt_rounds);
            const user: any = {
                email: "default@user.com",
                firstName: "John",
                lastName: "Doe",
                passwordHash: hashed
            }
             await repo.save(user)
            console.log("Seed Executed!")
        }
        return true;
    } catch (error) {
        console.log({seedError: error.message})
        return false
    }
}

export default {
    SeedUser
}