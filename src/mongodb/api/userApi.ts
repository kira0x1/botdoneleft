import { GuildMember } from 'discord.js';
import { IRapsheet, IRole, IUser, User } from '../models/user';

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
        if (user instanceof GuildMember) return await new User(converMemberToIUser(user)).save()
        return await new User(user).save()
    }
    catch (error) {
        console.error(error)
    }
}

export async function findUser(discordId: string): Promise<IUser> {
    try {
        const user = await User.findOne({ discordId: discordId })
        return user
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function findOrCreate(member: GuildMember) {
    let user = await findUser(member.id)
    if (!user) user = await createUser(member)
    return user
}

function converMemberToIUser(member: GuildMember) {
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

export async function addToRapsheet(user: IUser, rapsheet: IRapsheet) {
    user.rapsheet.push(rapsheet)
    return await user.save()
}