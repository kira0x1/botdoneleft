import { model, Schema } from "mongoose";


//TODO also add rank I.E mod: 1, janitor: 2
export interface IRole {
    name: string,
    id: string
}

export interface IUser {
    username: string,
    tag: string,
    roles: IRole[],
    id: string
}

export interface IRapsheet {
    reason?: string,
    punishment: string,
    duration: string,
    moderatedBy: string
}

export const UserSchema = new Schema({
    username: { type: String, required: true },
    discordId: { type: String, required: true },
    tag: { type: String, required: true },
    roles: { type: Array<IRole>(), required: true },
    rapsheet: { type: Array<IRapsheet>(), required: true },
    createdAt: Date
})

export const userModel = model('users', UserSchema)