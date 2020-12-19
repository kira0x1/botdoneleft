import { GuildMember, Message, Client, Collection } from "discord.js";

export class BdlClient extends Client {
    commands: Collection<string, commandGroup>
}

export interface commandGroup {
    name: string,
    aliases: string[],
    commands: command[]
}

export interface command {
    name: string,
    description: string,
    aliases: string[],
    argS?: boolean,
    permissions?: permission[],

    execute(message: Message, args: string[], target?: GuildMember): void
}

declare type permission = 'admin' | 'moderator' | 'janitor' | 'member' | 'musicban' | 'allban'