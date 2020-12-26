import { Command } from "../../types/bdl";
import { getTarget } from "../../util/discordUtil";

export const command: Command = {
    name: 'Warn',
    aliases: ['w'],
    description: 'Warn a user',
    args: true,
    permissions: ["moderator", "janitor"],

    async execute(message, args) {
        if (args.length < 2) return message.reply('please use a proper id or mention, and specify the reason')

        const member = getTarget(args[0], message)
        if (!member) return message.reply('Failed to find member, please use a proper id or mention')

        const reason = args.slice(1).join(' ')

        try {
            
        } catch (error) {
            return message.channel.send(`Failed to warn **${member.displayName}**`)
        }

        return message.channel.send(`Warned **${member.displayName}**\nReason: ${reason}`)
    }
}