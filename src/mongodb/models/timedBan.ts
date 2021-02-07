import { Document, model, Schema } from "mongoose";
import { punishment } from "./user";

export interface ITimedBanUser extends Document {
    discordid: string,
    isMuted: boolean,
    isGulaged: boolean,
    gulagedDate: number,
    mutedDate: number,
    gulagTime: number,
    muteTime: number,
    overrides: IPunishmentOverride[]
}

export interface IPunishmentOverride {
    modid: string,
    username: string,
    punishment: punishment,
    time: number
}

export const TimedBanSchema = new Schema({
    discordId: { type: String, required: true },
    isMuted: { type: Boolean, required: true },
    isGulaged: { type: Boolean, required: true },
    gulagedDate: { type: Number, required: true },
    gulagTime: { type: Number, required: true },
    mutedDate: { type: Number, required: true },
    mutedTime: { type: Number, required: true },
    overrides: { type: Array<IPunishmentOverride>(), required: true }
})

export const TimedBans = model<ITimedBanUser>('timedbans', TimedBanSchema);