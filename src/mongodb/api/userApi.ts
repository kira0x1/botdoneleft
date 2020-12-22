import { IUser, IRole, User } from '../models/user';
import { GuildMember } from 'discord.js';

export async function findAllUsers() {
    try {
        const usersFound: IUser[] = await User.find({}).lean()
        return usersFound;
    } catch (error) {
        console.error(error)
    }
}

export async function createUser(user: IUser | GuildMember) {
    try {
        if (user instanceof GuildMember) user = converMemberToIUser(user)
        const dbuser = new User(user)
        return await dbuser.save()
    }
    catch (error) {
        console.error(error)
    }
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

export async function findOrCreate(id: string, member: GuildMember) {
    let user: any = await findUser(id)
    if (!user) user = await createUser(member)
    return user
}

function converMemberToIUser(member: GuildMember): IUser {
    const roles: IRole[] = []
    member.roles.cache.map(r => roles.push({ name: r.name, id: r.id }))

    return {
        username: member.user.username,
        discordId: member.id,
        tag: member.user.tag,
        roles: roles,
        rapsheet: []
    }
}