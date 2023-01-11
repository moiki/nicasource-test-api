import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {ApiModel, ApiModelProperty} from "swagger-express-ts";

export enum TASK_STATUS {
    PENDING ='Pending',
    PROGRESS = 'In Progress',
    DONE = "Done"
}

@ApiModel( {
    description : "Task model" ,
    name : "v1"
} )
@Entity({ name: "tasks" })
export  class Task {
    @ApiModelProperty( {
        description : "Id of version" ,
        required : true,
        example: ['uuid expression']
    } )
    @PrimaryGeneratedColumn("increment")
    id?: number;
    @Column()

    title: string;

    @Column()
    description: string;
    @Column({
        type: "enum",
        enum: TASK_STATUS,
        default: TASK_STATUS.PENDING,
    })
    status?: TASK_STATUS;
    @ManyToOne(() => User, (user) => user.tasks)
    user: User
}