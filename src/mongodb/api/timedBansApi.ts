import { GuildMember } from 'discord.js';
import { ITimedBanUser, TimedBans } from '../models/timedBan';
import { punishment } from '../models/user';

export async function createTimedBanUser(member: GuildMember) {
    try {
        const tb = {
            discordId: member.id,
            TimedBans: []
        }

        return await new TimedBans(tb).save();
    } catch (error) {
        console.error(error)
    }
}

export async function findTimedBan(discordId: string): Promise<ITimedBanUser> {
    try {
        const tb = await TimedBans.findOne({ discordId: discordId })
        return tb;
    } catch (error) {
        console.error(error);
        return error
    }
}

export async function findOrCreate(member: GuildMember) {
    let user = await findTimedBan(member.id);
    if (!user) user = await createTimedBanUser(member);
    return user
}

export async function addTimedBan(member: GuildMember, mod: GuildMember, time: number, punishment: punishment) {
    if (punishment === 'warn') return

    const user = await findOrCreate(member)

    if ((punishment === 'gulag' && user.isGulaged) || (punishment === 'mute' && user.isMuted)) {
        addOverride(user, mod, punishment, time)
    }
}

async function addOverride(user: ITimedBanUser, mod: GuildMember, punishment: punishment, time: number) {
    user.overrides.push({
        modid: mod.id,
        punishment: punishment,
        time: time,
        username: mod.displayName
    })

    if (punishment === 'gulag')
        user.gulagTimer = time
    else if (punishment === "mute")
        user.muteTimer = time;
}