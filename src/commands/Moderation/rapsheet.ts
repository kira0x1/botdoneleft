import { findOrCreate, findUser } from "../../mongodb/api/userApi";
import { Command } from "../../types/bdl";

export const command: Command = {
    name: 'rapsheet',
    description: 'Retrieves a given users rapsheet',
    aliases: ['rs'],
    permissions: ["admin", 'moderator', 'janitor'],
    // args: true,
    usage: '[id | name]',

    async execute(message, args) {
        const target = message.mentions.members?.first() || message.member
        const id = target.id

        const user = await findOrCreate(id, target)

        if (!user) {
            return message.channel.send('user not found')
        }

        message.channel.send(`User: ${user.username}\nrapsheet size: ${user.rapsheet.length}`)
    }
}