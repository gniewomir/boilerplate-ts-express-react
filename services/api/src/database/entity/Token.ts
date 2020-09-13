import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Token {

    @PrimaryColumn(
        {
            type: "varchar",
            unique: true,
        }
    )
    token: string;

    @Column()
    expiration: Date;

    @ManyToOne(() => User, user => user.tokens, {onDelete: 'CASCADE'})
    user: User

    @Column()
    blacklisted: boolean;

}
