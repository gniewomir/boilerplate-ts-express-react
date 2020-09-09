import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

}
