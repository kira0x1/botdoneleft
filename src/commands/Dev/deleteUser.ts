import { findUser } from '../../mongodb/api/userApi';
import { Command } from '../../types/bdl';
import { quickEmbed } from '../../util/styleUtil';
import { User, UserSchema } from '../../mongodb/models/user';
export const command: Command = {
    name: 'Delete User',
    description: 'Deletes a user from the database',
    aliases: [],
    permissions: ['admin'],

    async execute(message, args) {
        const target = message.mentions.members?.first() || message.member

        const userFound = await findUser(target.id)
        if (!userFound) return quickEmbed(message, `User "${target.displayName}" not found`)
    }
}