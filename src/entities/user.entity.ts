import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {Task} from "./task.entity";
import {ApiModel} from "swagger-express-ts";

@Entity({ name: "users" })
@ApiModel( {
    description : "User model for account" ,
    name : "v1"
} )
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()

    firstName: string;

    @Column()

    lastName: string;
    @Column({unique: true})

    email: string;

    @Column()
    passwordHash: string;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[]

}