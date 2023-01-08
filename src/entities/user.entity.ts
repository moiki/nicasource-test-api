import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {Task} from "./task.entity";
// import { Tweet } from "./Tweet";

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
    photos: Task[]

}