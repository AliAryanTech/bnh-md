import { Command } from "../../models/Command";

export = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Returns pong'
        })
    }

    run = async (msg, args) => {
        const sock = this.client.sock

        sock.sendMessage(msg.key.remoteJid!, { text: `Args is here: ${args}` })
    }
}
