
import { Command } from "../../base/Command";

export = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Returns pong',
          
        })
    }
    
    run = async (m,args) => {
        const sock = this.client.sock
     const key = args
        sock.sendMessage(m.from, { text: `text: ${key}` })
    }
}