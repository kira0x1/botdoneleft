import chalk from "chalk";
import { Collection } from "discord.js";
import { readdirSync } from "fs";
import path from 'path';
import { BdlClient, Command, commandGroup } from '../types/bdl';

export async function LoadCommands(bot: BdlClient) {
    bot.commands = new Collection()

    readdirSync(path.join(__dirname, '../commands')).map(folder => {
        console.log(chalk.bgRed.bold(folder))
        const commandGroup: commandGroup = {
            name: folder,
            aliases: [],
            commands: []
        }

        commandGroup.commands = getCommandsFromFolder(folder)
        bot.commands.set(folder, commandGroup)
    })
}

function getCommandsFromFolder(folder: string): Array<Command> {
    const commands: Command[] = []
    const rootPath = path.join(__dirname, '../commands', folder)

    readdirSync(rootPath).filter(file => file.endsWith('.js')).map(file => {
        const { command } = require(path.join(rootPath, file))
        console.log(command.name)
        commands.push(command)
    })

    return commands
}