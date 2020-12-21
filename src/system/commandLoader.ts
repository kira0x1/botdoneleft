import chalk from "chalk";
import { Collection } from "discord.js";
import { readdirSync } from "fs";
import path from 'path';
import { BdlClient, Command, CommandGroup, FolderMeta } from '../types/bdl';

const rootPath = path.join(__dirname, '../commands')


export async function LoadCommands(bot: BdlClient) {
    bot.commands = new Collection()

    readdirSync(rootPath).map(folder => {
        const commandGroup: CommandGroup = {
            name: folder,
            description: '',
            aliases: [],
            commands: []
        }

        const commands = getCommandsFromFolder(folder)

        const meta = getMetaFile(folder)

        if (meta) {
            commandGroup.description = meta.description;

            if (meta.aliases) commandGroup.aliases = meta.aliases
            if (meta.permissions) commandGroup.permissions = meta.permissions
        }

        commandGroup.commands = commands
        bot.commands.set(folder, commandGroup)
    })
}

function getMetaFile(folder: string) {
    let metaFound: FolderMeta

    readdirSync(path.join(rootPath, folder)).find(file => {
        if (file === "meta.js") {
            const { meta } = require(path.join(rootPath, folder, file))
            metaFound = meta
        }
    })

    return metaFound
}

function getCommandsFromFolder(folder: string): Array<Command> {
    const commands: Command[] = []

    readdirSync(path.join(rootPath, folder))
        .filter(file => file.endsWith('.js') && file !== "meta.js")
        .map(file => {
            const { command } = require(path.join(rootPath, folder, file))
            commands.push(command)
        })

    return commands
}