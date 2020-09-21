import {IDataTransferObject} from "./IDataTransferObject";

export interface IMapper {
    toDTO(): IDataTransferObject
}