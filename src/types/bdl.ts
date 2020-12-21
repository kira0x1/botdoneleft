import { GuildMember, Message, Client, Collection } from "discord.js";

export class BdlClient extends Client {
    commands: Collection<string, CommandGroup>
    prefix: string = "!"
}

export interface CommandGroup {
    name: string,
    description: string,
    aliases: string[],
    commands: Command[]
}

export interface FolderMeta {
    description: string
}

export interface Command {
    name: string,
    description: string,
    aliases: string[],
    args?: boolean,
    usage?: string,
    permissions?: permission[],

    execute(message: Message, args: string[], target?: GuildMember): void
}

declare type permission = 'admin' | 'moderator' | 'janitor' | 'member' | 'musicban' | 'allban'