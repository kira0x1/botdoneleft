import { Document, model, Schema } from "mongoose";
import { punishment } from "./user";

export interface ITimedBanUser extends Document {
    guildId: string,
    discordId: string,
    mutedBy: string,
    gulagedBy: string,
    isMuted: boolean,
    isGulaged: boolean,
    gulagedDate: number,
    gulagTime: number,
    mutedDate: number,
    mutedTime: number,
    overrides: IPunishmentOverride[]
}

export interface IPunishmentOverride {
    modId: string,
    modName: string,
    previousModId: string,
    punishment: punishment,
    previousTime: number,
    time: number
}

export const TimedBanSchema = new Schema({
    guildId: { type: String, required: true },
    discordId: { type: String, required: true },
    gulagedBy: { type: String, required: true },
    mutedBy: { type: String, required: true },
    isMuted: { type: Boolean, required: true },
    isGulaged: { type: Boolean, required: true },
    gulagedDate: { type: Number, required: true },
    gulagTime: { type: Number, required: true },
    mutedDate: { type: Number, required: true },
    mutedTime: { type: Number, required: true },
    overrides: { type: Array<IPunishmentOverride>(), required: true }
})

export const TimedBans = model<ITimedBanUser>('timedbans', TimedBanSchema);