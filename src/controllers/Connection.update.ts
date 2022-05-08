import { Boom } from '@hapi/boom'
import { Event } from "../models/Event"
import { DisconnectReason, ConnectionState, makeInMemoryStore } from '@adiwajshing/baileys'
import chalk from 'chalk'
import pino from 'pino'

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'connection.update'
        })
    }

    run = async (update: ConnectionState) => {
        
        const { connection, lastDisconnect ,qr} = update
       
       const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
        store.readFromFile('./src/sessions/baileys_store_multi.json')
        // save every 10s
        setInterval(() => {
            store.writeToFile('./src/sessions/baileys_store_multi.json')
        }, 10_000)
        if (connection === 'connecting') {
            console.log(chalk.black(`[SYS]: connecting...`));
         } else if (connection === 'close')  {
            if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) { console.log('Connection closed, reconnecting....');
                this.client.start()
            }
        }else if (connection === 'open') {
            console.log(chalk.blue('[SYS] : Succesfully Connected...'));
        } else if (connection === 'DisconnectReason.connectionClosed') {
            console.log(chalk.red('[SYS] :  Connection closed. retrying...')); this.client.start()(
     store.bind(this.client.sock.ev)
        )};}}