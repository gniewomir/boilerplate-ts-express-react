import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Token} from "./Token";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 150
    })
    name: string;

    @Column({
        type: "varchar",
        length: 150,
        unique: true,
    })
    email: string;

    @Column({
        type: "varchar",
    })
    password: string;

    @Column({
        type: "varchar",
    })
    salt: string;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

}
