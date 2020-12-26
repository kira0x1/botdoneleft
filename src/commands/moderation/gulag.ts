import ms from "ms";
import { Command } from "../../types/bdl";
import { getTarget } from "../../util/discordUtil";

const gulagRoleId = '778679179293884440'

export const command: Command = {
    name: 'Gulag',
    description: 'Gulags a user',
    aliases: ['g', 'ban'],
    args: true,
    permissions: ["admin"],
    usage: '[id | @user] [time] [reason]',

    async execute(message, args) {
        if (args.length < 3) return message.reply('please use a proper id or mention, length of gulag, and specify the reason')

        const member = getTarget(args[0], message)
        if (!member) return message.reply('Failed to find member, please use a proper id or mention')

        const time = ms(args[1])

        const reason = args.slice(2).join(' ')

        try {
            await member.roles.add(gulagRoleId, reason)
        } catch (error) {
            return message.channel.send(`Failed to gulag **${member.displayName}**`)
        }

        return message.channel.send(`Gulagged **${member.displayName}** for ${args[1]}\nReason: ${reason}`)
    }
}