import { Command } from "../../models/Command";

module.exports = class extends Command {
    constructor(client: any) {
        super(client, {
            name: 'ping',
            description: 'Returns pong'
        })
    }

    run = async (msg, args) => {
        const sock = this.client.sock

        sock.sendMessage(msg.from, { text: `${args}` })
    }
}
