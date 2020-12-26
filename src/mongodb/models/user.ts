import { Document, model, Schema } from "mongoose";

declare type punishment = "warn" | "mute" | "gulag"

export interface IRapsheet {
    punishment: punishment,
    moderatedBy: string
    reason?: string,
    duration?: string,
    date: string
}

//TODO also add rank I.E mod: 1, janitor: 2
export interface IRole {
    name: string,
    id: string
}

export interface IUser extends Document {
    username: string,
    discordId: string
    tag: string,
    roles: IRole[],
    rapsheet: IRapsheet[]
}

export const UserSchema = new Schema({
    username: { type: String, required: true },
    discordId: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    roles: { type: Array<IRole>(), required: true },
    rapsheet: { type: Array<IRapsheet>(), required: true },
    createdAt: Date
})

export const User = model<IUser>('users', UserSchema)