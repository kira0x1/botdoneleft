import chalk from 'chalk';
import { Collection, GuildMember, Guild } from 'discord.js';
import { bot } from '../../app';
import { ITimedBanUser, TimedBans, IPunishmentOverride } from '../models/timedBan';
import { punishment } from '../models/user';
import { findOrCreateServer } from './serverApi';

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
            guildId: member.guild.id,
            discordId: member.id,
            gulagedBy: 'none',
            mutedBy: 'none',
            isMuted: false,
            isGulaged: false,
            gulagedDate: 0,
            gulagTime: 0,
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

export async function findOrCreateTimedBanUser(member: GuildMember) {
    let user = await findTimedBan(member.id);
    if (!user) user = await createTimedBanUser(member);
    return user
}

export async function addTimedBan(member: GuildMember, mod: GuildMember, time: number, punishment: punishment) {
    if (punishment === 'warn') return

    const user = await findOrCreateTimedBanUser(member)

    const now = Date.now();

    if ((punishment === 'gulag' && user.isGulaged) || (punishment === 'mute' && user.isMuted)) {
        addOverride(user, mod, punishment, time)
    }

    if (punishment === "mute") {
        user.isMuted = true;
        user.mutedDate = now;
        user.mutedTime = time;
        user.mutedBy = mod.id;
    }
    else if (punishment === "gulag") {
        user.isGulaged = true;
        user.gulagedDate = now;
        user.gulagTime = time;
        user.gulagedBy = mod.id
    }

    user.save();
    setPunishmentTimer(member.guild, member.id, punishment, time)
}

function addOverride(user: ITimedBanUser, mod: GuildMember, punishment: punishment, time: number) {
    const prevModId = punishment === 'gulag' ? user.gulagedBy : user.mutedBy
    const prevTime = punishment === 'gulag' ? user.gulagTime : user.mutedTime

    const ov: IPunishmentOverride = {
        modId: mod.id,
        modName: mod.displayName,
        punishment: punishment,
        time: time,
        previousModId: prevModId,
        previousTime: prevTime
    }

    user.overrides.push(ov)
}

function setPunishmentTimer(guild: Guild, discordId: string, punishment: punishment, time: number) {
    const now = Date.now();

    setTimeout(() => {
        const ts = Date.now();
        const diff = ts - now;
        OnPunishmentDone(guild, discordId, punishment)
    }, time)
}

async function OnPunishmentDone(guild: Guild, discordId: string, punishment: punishment) {
    const user = await findTimedBan(discordId)

    const server = await findOrCreateServer(guild)
    const member = guild.members.cache.get(discordId)
    if (!member) return console.log('member not found, they probably left the server')

    if (punishment === 'gulag') {
        user.isGulaged = false;
        try {
            member.roles.remove(server.gulagRoleId)
        } catch (error) {
            console.error(error)
        }

    } else if (punishment === 'mute') {
        user.isMuted = false;
        try {
            member.roles.remove(server.muteRoleId)
        }
        catch (error) {
            console.error(error)
        }
    }

    user.save();
}

const timedBansEvents: Collection<string, any[]> = new Collection();

export async function RefreshTimedBans() {
    const timedBans = await findAllTimedBans()

    console.log(`-----------------------`);
    console.log(chalk.bgRed.bold(`TIMED BANS\n`))
    console.table(timedBans.filter(user => user.isMuted || user.isGulaged))
    console.log(`-----------------------\n`);

    timedBans.map(user => {
        const guild = bot.guilds.cache.get(user.guildId)

        if (user.isMuted) {
            const timeDiff = Date.now() - user.mutedDate

            let timeLeft = timeDiff < 0 ? 0 : user.mutedTime - timeDiff
            if (timeLeft < 0) timeLeft = 0

            setTimeout(() => OnPunishmentDone(guild, user.discordId, 'mute'), timeLeft);
        }

        if (user.isGulaged) {
            const timeDiff = Date.now() - user.gulagedDate
            let timeLeft = timeDiff < 0 ? 0 : user.gulagTime - timeDiff
            if (timeLeft < 0) timeLeft = 0

            setTimeout(() => OnPunishmentDone(guild, user.discordId, 'gulag'), timeLeft);
        }
    })
}
