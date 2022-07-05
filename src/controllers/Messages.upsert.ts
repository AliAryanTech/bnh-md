import Message from "../client/Message"
import { Event } from "../models/Event"

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'messages.upsert'
        })
    }

    run = async (m) => {
        const msg = m.messages[0]
        const messageContent = (msg.message?.conversation ||  msg.message?.extendedTextMessage?.text)
        
        if (messageContent) {
            const messageArgs = messageContent.split(' ')

            const [commandName, ...args] = messageArgs
            const command = this.client.commands.find((command) => command.name === (commandName));

            if (command) command.run(msg,args,Message)
        }

    } 
}
