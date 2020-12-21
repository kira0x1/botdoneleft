import { IUser, IRole, User } from '../models/user';
import { GuildMember } from 'discord.js';

export async function createUser(user: IUser | GuildMember) {
    if (user instanceof GuildMember) user = converMemberToIUser(user)
    const dbuser = new User(user)

    return dbuser.save()
}

export async function findUser(discordId: string): Promise<IUser> {
    try {
        const user: any = await User.findOne({ discordId: discordId })
        return user
    } catch (error) {
        console.error(error)
        return error
    }
}

function converMemberToIUser(member: GuildMember): IUser {
    const roles: IRole[] = []
    member.roles.cache.map(r => roles.push({ name: r.name, id: r.id }))

    return {
        username: member.user.username,
        id: member.id,
        tag: member.user.tag,
        roles: roles,
        rapsheet: []
    }
}