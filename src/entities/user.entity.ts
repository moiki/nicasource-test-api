import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {Task} from "./task.entity";

@Entity({ name: "users" })
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