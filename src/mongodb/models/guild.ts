import { Document, model, Schema } from "mongoose";
import { IRole } from "./user";

export interface IGuild extends Document {
    name: string,
    guildId: string,
    rolesToPersist: IRole[]
}

export interface IOwner {
    name: string,
    discordId: string
}

export const GuildSchema = new Schema({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    ownerId: { type: String, required: true },
    rolesToPersist: { type: Array<IRole>(), required: true },
    createdAt: Date
})

//TODO Reference users in guild schema later 


export const Guild = model<IGuild>('guilds', GuildSchema);