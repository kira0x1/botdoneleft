import { Command } from "../../types/bdl";

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    description: 'Lists all commands, and provides usage for specific commands',

    async execute(message, args) {
        message.channel.send('meow')
    }
}