import { Boom } from '@hapi/boom'
import { Event } from "../models/Event"
import { DisconnectReason, ConnectionState } from '@adiwajshing/baileys'

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'connection.update'
        })
    }

    run = async (update: ConnectionState) => {
        
        const { connection, lastDisconnect } = update
        
        if (connection === 'close')  {
            if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                this.client.start()
            }
        }
    }
}