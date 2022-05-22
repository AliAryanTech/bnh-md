import { Event } from "../models/Event"

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'group-participants.update'
        })
    }
    run = async (m) => {
        let sock = this.client.sock
        const botNumber = sock.user.id
        let jid = m.id;
        let meta = await sock.groupMetadata(jid)
        let participants = m.participants
    }}
    /* ill do something later xd */