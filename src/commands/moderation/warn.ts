import { addToRapsheet, findOrCreate } from "../../mongodb/api/userApi";
import { IRapsheet } from "../../mongodb/models/user";
import { Command } from "../../types/bdl";
import { createRapsheet, getTarget } from "../../util/discordUtil";
import { createFooter } from "../../util/styleUtil";

export const command: Command = {
    name: 'Warn',
    aliases: ['w'],
    description: 'Warn a user',
    args: true,
    permissions: ["moderator", "janitor"],

    async execute(message, args) {
        if (args.length < 2) return message.reply('please use a proper id or mention, and specify the reason')

        const member = await getTarget(args[0], message)
        if (!member) return message.reply('Failed to find member, please use a proper id or mention')

        const reason = args.slice(1).join(' ')

        try {
            const user = await findOrCreate(member)
            const rap: IRapsheet = createRapsheet("warn", reason, message.author.id, message.createdAt)
            addToRapsheet(user, rap)
        } catch (error) {
            return message.channel.send(`Failed to warn **${member.displayName}**`)
        }

        const embed = createFooter(message)
            .setTitle('You have been warned!')
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setDescription(`${message.member} has warned ${member}`)
            .addField('reason', reason)

        return message.channel.send(embed)
    }
}