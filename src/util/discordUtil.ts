import { GuildMember, Message, User } from "discord.js";
import { IRapsheet, punishment } from "../mongodb/models/user";
import { admins, Command, janitorRole, moderatorRole } from "../types/bdl";
import { IPunishmentOverride } from '../mongodb/models/timedBan';
import ms from "ms";

export async function getTarget(query: string, message: Message) {
    if (!query) return;
    if (message.mentions.members.size > 0) {
        return getMemberFromMentions(query, message)
    }

    const guild = message.guild;

    query = query.toLowerCase();

    // Search for members by name and id
    let member = guild.members.cache.find(m => m.displayName.toLowerCase() === query || m.id === query);
    if (member) return member

    //If user wasnt found either due to a typo, or the user wasnt cached then query query the guild.
    const memberSearch = await guild.members.fetch({ query: query, limit: 1 });

    if (memberSearch && memberSearch.first()) {
        return memberSearch.first();
    }
}

function getIdFromMentions(mention: string) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    return matches[1];
}

export function getUserFromMentions(mention: string, message: Message): User {
    const id = getIdFromMentions(mention);
    if (!id) return;

    return message.client.users.cache.get(id);
}

export function getMemberFromMentions(mention: string, message: Message): GuildMember {
    const id = getIdFromMentions(mention);
    if (!id) return;
    return message.guild.members.cache.get(id);
}

export function createRapsheetField(rapsheet: IRapsheet) {
    let field = `${rapsheet.date.toLocaleDateString()} <@${rapsheet.moderatedBy}>\t\tReason: **${rapsheet.reason}**`
    if (rapsheet.punishment !== 'warn') field += `\t\tDuration: **${rapsheet.duration}**`

    return field;
}

export function createOverrideField(override: IPunishmentOverride) {
    return `<@${override.modId}>, previous: <@${override.previousModId}>, Time: ${ms(override.time)}, Previous Time: ${ms(override.previousTime)}`
}


export function createRapsheet(punishment: punishment, reason: string, moderatorId: string, date: Date, duration?: number) {
    const rap: IRapsheet = {
        moderatedBy: moderatorId,
        punishment: punishment,
        reason: reason,
        date: date
    }

    if (duration) rap.duration = ms(duration, { long: true })
    return rap
}

export function checkPermission(member: GuildMember, command: Command) {

    // If the command has no permissions then give access
    if (!command.permissions) return true;

    // If an admin give access to all commands
    if (admins.includes(member.id)) return true

    // If the command requires admin access, check if the member is an admin
    if (command.permissions.includes("admin") && !admins.includes(member.id)) return false;

    // Check for moderator commands
    if (command.permissions.includes("moderator") && member.roles.cache.has(moderatorRole)) return true;

    // Check for janitor commands
    if (command.permissions.includes("janitor") && member.roles.cache.has(moderatorRole)) return true;
    if (command.permissions.includes("janitor") && member.roles.cache.has(janitorRole)) return true;

    return false
}