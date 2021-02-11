import ms from "ms";
import { findOrCreateServer } from "../../mongodb/api/serverApi";
import { addTimedBan } from "../../mongodb/api/timedBansApi";
import { addToRapsheet, findOrCreate } from "../../mongodb/api/userApi";
import { IRapsheet } from "../../mongodb/models/user";
import { Command } from "../../types/bdl";
import { createRapsheet, getTarget } from "../../util/discordUtil";
import { addCodeField, createFooter } from '../../util/styleUtil';

export const command: Command = {
    name: 'Gulag',
    description: 'Gulags a user',
    aliases: ['g', 'ban'],
    args: true,
    permissions: ["admin"],
    usage: '[id | @user] [time] [reason]',

    async execute(message, args) {
        if (args.length < 3) return message.reply('please use a proper id or mention, length of gulag, and specify the reason')

        const member = await getTarget(args[0], message)
        if (!member) return message.reply('Failed to find member, please use a proper id or mention')

        const timeArgs = args[1]
        const time = ms(timeArgs)
        const reason = args.slice(2).join(' ')

        try {

            const server = await findOrCreateServer(message.guild)

            if (server.gulagRoleId === "empty") {
                return message.channel.send(`You have not assigned the gulag role yet.`)
            }

            const user = await findOrCreate(member)
            const rap: IRapsheet = createRapsheet("gulag", reason, message.author.id, message.createdAt, time)
            addToRapsheet(user, rap)

            await member.roles.add(server.gulagRoleId, reason)
            await addTimedBan(member, message.member, time, 'gulag')
        } catch (error) {
            return message.channel.send(`Failed to gulag **${member.displayName}**`)
        }

        const embed = createFooter(message)
            .setTitle('You have been banished to the Gulag')
            .setDescription(`${message.author} gulaged ${member}) ${time ? `for ${timeArgs}` : 'forever'}`)

        addCodeField(embed, member.id, 'ID', true)
        addCodeField(embed, reason, 'Reason', true)

        return message.channel.send(embed)
    }
}