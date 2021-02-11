import { Guild } from 'discord.js';
import { IServer, Server } from '../models/server';

export async function createServer(guild: Guild) {
    try {
        const server = {
            name: guild.name,
            guildId: guild.id,
            gulagRoleId: 'empty',
            muteRoleId: 'empty'
        }

        return await new Server(server).save();
    }
    catch (error) {
        console.error(error)
        return error
    }
}

export async function setMuteRole(muteRoleId: string, guild: Guild) {
    try {
        const server = await findOrCreateServer(guild)
        server.muteRoleId = muteRoleId
        return await server.save();
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function setGulagRole(gulagRoleId: string, guild: Guild) {
    try {
        const server = await findOrCreateServer(guild)
        server.gulagRoleId = gulagRoleId
        return await server.save();
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function findOrCreateServer(guild: Guild): Promise<IServer> {
    try {
        let server = await findServer(guild.id)
        if (!server) server = await createServer(guild)
        return server
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function findServer(id: string) {
    try {
        return await Server.findOne({ guildId: id })
    }
    catch (error) {
        console.error(error)
        return error
    }
}