import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Token} from "./Token";
import {IMapper} from "../interface/IMapper";
import {IUserDto} from "../../domain/interface/user";

@Entity()
export class User implements IMapper {

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

    toDTO(): IUserDto {
        return {
            id: this.id,
            email: this.email,
            name: this.name
        };
    }

}
