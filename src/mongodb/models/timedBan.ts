import { Document, model, Schema } from "mongoose";
import { punishment } from "./user";

export interface ITimedBanUser extends Document {
    discordid: string,
    isMuted: boolean,
    isGulaged: boolean,
    gulagTimer: number,
    muteTimer: number,
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
    gulagTimer: { type: Number, required: true },
    muteTimer: { type: Number, required: true },
    overrides: { type: Array<IPunishmentOverride>(), required: true }
})

export const TimedBans = model<ITimedBanUser>('timedbans', TimedBanSchema);