import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

export enum TASK_STATUS {
    PENDING ='Pending',
    PROGRESS = 'In Progress',
    DONE = "Done"
}
@Entity({ name: "tasks" })
export  class Task {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;

    @Column()
    description: string;
    @Column({
        type: "enum",
        enum: TASK_STATUS,
        default: TASK_STATUS.PENDING,
    })
    status: TASK_STATUS;
    @ManyToOne(() => User, (user) => user.photos)
    user: User
}