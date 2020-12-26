import { addToRapsheet, findOrCreate } from "../../mongodb/api/userApi";
import { IRapsheet } from "../../mongodb/models/user";
import { Command } from "../../types/bdl";
import { getTarget } from "../../util/discordUtil";
import { createFooter } from "../../util/styleUtil";

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
            const user = await findOrCreate(member.id, member)
            const rap: IRapsheet = {
                moderatedBy: message.author.id,
                punishment: "warn",
                reason: reason,
                date: message.createdAt.toLocaleDateString()
            }

            const res = await addToRapsheet(user, rap)
            if (!res) console.log('error trying to add rapsheet during warning???')
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