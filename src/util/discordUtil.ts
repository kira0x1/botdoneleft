import { GuildMember, Message, User } from "discord.js";
import { IRapsheet, punishment } from "../mongodb/models/user";
import { admins, Command, janitorRole, moderatorRole } from "../types/bdl";

export function getTarget(query: string, message: Message) {
    if (!query) return;
    if (message.mentions.members.size > 0) {
        return getMemberFromMentions(query, message)
    }

    const guild = message.guild;

    query = query.toLowerCase();

    // Search for members by name and id
    let member = guild.members.cache.find(m => m.displayName.toLowerCase() === query || m.id === query);

    // If we found the member the return it
    return member;
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
    return `${rapsheet.date.toLocaleDateString()} <@${rapsheet.moderatedBy}>\t\t${rapsheet.reason}`
}

export function createRapsheet(punishment: punishment, reason: string, moderatorId: string, date: Date, duration?: string) {
    const rap: IRapsheet = {
        moderatedBy: moderatorId,
        punishment: punishment,
        reason: reason,
        date: date
    }
    if (duration) rap.duration = duration
    return rap
}

export function checkPermission(member: GuildMember, command: Command) {

    // If the command has no permissions then give access
    if (!command.permissions) return true;

    // If an admin give access to all commands
    if (admins.includes(member.id)) return true

    // If the command requires admin access, check if the member is an admin
    if (command.permissions.includes("admin") && admins.includes(member.id)) return true;

    // Check for moderator commands
    if (command.permissions.includes("moderator") && member.roles.cache.has(moderatorRole)) return true;

    // Check for janitor commands
    if (command.permissions.includes("janitor") && member.roles.cache.has(moderatorRole)) return true;
    if (command.permissions.includes("janitor") && member.roles.cache.has(janitorRole)) return true;

    return false
}