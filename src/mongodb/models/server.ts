import { Document, model, Schema } from 'mongoose';

export interface IServer extends Document {
    name: string,
    guildId: string,
    gulagRoleId: string,
    muteRoleId: string
}


export const ServerSchema = new Schema({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    gulagRoleId: { type: String, required: true },
    muteRoleId: { type: String, required: true }
})

export const Server = model<IServer>('servers', ServerSchema)