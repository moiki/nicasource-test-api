import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {TASK_STATUS} from "./task.entity";
import * as crypto from "crypto";

@Entity({ name: "sessions" })
export  class Session {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @Column({type: "uuid", unique: true, default: crypto.randomUUID()})
    sessionToken: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    initSession: Date;
    @Column({type: 'datetime', nullable: true})
    endSession?: Date;

    @Column({default: true, type:"boolean"})
    isActive: boolean;
    @ManyToOne(() => User, (user) => user.sessions, {onDelete: "CASCADE"})
    user: User
}