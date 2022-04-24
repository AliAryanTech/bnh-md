import { isJidGroup, jidNormalizedUser } from "@adiwajshing/baileys"
import { Event } from "../models/Event"

module.exports =class extends Event {
    constructor(client) {
        super(client, {
            name: 'messages.upsert'
        })
    }

 
    
    run = async (m) => {




        const sock = this.client.sock
        const msg = m.messages[0]
        const messageContent = (msg.message?.conversation ||  msg.message?.extendedTextMessage?.text)
        let from = m.messages[0].key.remoteJid
        let sender = m.sender
        let pushname = m.pushName
        let isGroupMsg = isJidGroup(from)
        let groupId = isGroupMsg ? from : ''
        let groupMetadata = isGroupMsg ? await this.client.sock.groupMetadata(groupId) : {}

        if (messageContent) {
            const messageArgs = messageContent.split(' ')

            const [commandName, ...args] = messageArgs
            const command = this.client.commands.find((command) => command.name === (commandName));

            if (command) command.run(msg,m, args)
        }

    } 
}