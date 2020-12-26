import { findUser } from '../../mongodb/api/userApi';
import { Command } from '../../types/bdl';
import { quickEmbed } from '../../util/styleUtil';

export const command: Command = {
    name: 'deleteUser',
    description: 'Deletes a user from the database',
    aliases: ['du'],
    permissions: ['admin'],

    async execute(message, args) {
        const target = message.mentions.members?.first() || message.member

        const userFound = await findUser(target.id)
        if (!userFound) return quickEmbed(message, `User "${target.displayName}" not found`)

        try {
            const deletedUser = await userFound.delete()
            quickEmbed(message, `Deleted **${deletedUser.username}** from the database`)
        } catch (err) {
            console.error(err)
        }
    }
}