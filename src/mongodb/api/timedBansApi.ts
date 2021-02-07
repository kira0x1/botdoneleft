import { Collection, GuildMember, Client } from 'discord.js';
import { bot } from '../../app';
import { ITimedBanUser, TimedBans } from '../models/timedBan';
import { punishment } from '../models/user';
import { serverId } from '../../config';
import { gulagRoleId } from '../../commands/moderation/gulag';
import { muteRoleId } from '../../commands/moderation/mute';

async function findAllTimedBans() {
    try {
        const timedbans: ITimedBanUser[] = await TimedBans.find({}).lean();
        return timedbans
    }
    catch (error) {
        console.error(error)
    }
}

export async function createTimedBanUser(member: GuildMember) {
    try {
        const tb = {
            discordId: member.id,
            isMuted: false,
            isGulaged: false,
            gulagedDate: 0,
            gulagedTime: 0,
            mutedDate: 0,
            mutedTime: 0,
            override: []
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

    const now = Date.now();

    // if ((punishment === 'gulag' && user.isGulaged) || (punishment === 'mute' && user.isMuted)) {
    //     addOverride(user, mod, punishment, done)
    // }

    if (punishment === "mute") {
        user.isMuted = true;
        user.mutedDate = now;
        user.muteTime = time;
    }
    else if (punishment === "gulag") {
        user.isGulaged = true;
        user.gulagedDate = now;
        user.gulagTime = time;
    }

    setPunishmentTimer(member.id, punishment, time)
}

// async function addOverride(user: ITimedBanUser, mod: GuildMember, punishment: punishment, time: number) {
//     user.overrides.push({
//         modid: mod.id,
//         punishment: punishment,
//         time: time,
//         username: mod.displayName
//     })

//     if (punishment === 'gulag') {
//         user.isGulaged = true;
//         user.gulagDoneDate = time;
//     }
//     else if (punishment === "mute") {
//         user.isMuted = true;
//         user.muteDoneDate = time;
//     }
// }

function setPunishmentTimer(discordId: string, punishment: punishment, time: number) {
    let events = timedBansEvents.get(discordId)
    if (!events) {
        timedBansEvents.set(discordId, [])
        events = timedBansEvents.get(discordId)
    }

    console.log(time)

    events.push(setTimeout(() => {
        OnPunishmentDone(discordId, punishment), time
    }))
}

async function OnPunishmentDone(discordId: string, punishment: punishment) {
    const user = await findTimedBan(discordId)
    if (punishment === 'gulag') {
        console.log('user gulag ended')
        user.isGulaged = false;
        try {
            bot.guilds.cache.get(serverId).members.cache.get(discordId).roles.remove(gulagRoleId)
        } catch (error) {
            console.error(error)
        }

    } else if (punishment === 'mute') {
        console.log('user mute ended')
        user.isMuted = false;
        try {
            bot.guilds.cache.get(serverId).members.cache.get(discordId).roles.remove(muteRoleId)
        }
        catch (error) {
            console.error(error)
        }
    }
}

const timedBansEvents: Collection<string, any[]> = new Collection();

// export async function RefreshTimedBans(client: Client) {
//     const timedBans = await findAllTimedBans()

//     timedBans.map(tb => {
//         if (tb.isGulaged) {
//             setPunishmentTimer(tb.discordid, "gulag", tb.gulagDoneDate)
//         } else {
//             setPunishmentTimer(tb.discordid, "mute", tb.muteDoneDate)
//         }
//     })
// }