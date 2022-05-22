import { Boom } from '@hapi/boom'
import { Event } from "../models/Event"
import { DisconnectReason, ConnectionState, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys/lib'
import chalk from 'chalk'
import pino from 'pino'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'connection.update'
        })
    }

    run = async (update: ConnectionState) => {
        if (global.qr !== update.qr) {
            global.qr = update.qr
        }

        const logger = MAIN_LOGGER.child({ })
        logger.level = 'trace'
        const useStore = !process.argv.includes('--no-store')
        const store = useStore ? makeInMemoryStore({ logger }) : undefined
        store?.readFromFile('./src/sessions/baileys_store_multi.json')
        // save every 10s
        setInterval(() => {
            store?.writeToFile('./src/sessions/baileys_store_multi.json')
        }, 10_000)
        
        global.store = store
    
const doReplies = !process.argv.includes('--no-reply')
let session = './session.json'
const { saveState } = useSingleFileAuthState(session)
        const { connection, lastDisconnect ,qr} = update
       
        if (connection === 'connecting') {
            console.log(chalk.black(`[SYS]: connecting...`));
         } else if (connection === 'close')  {
            if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) { console.log('Connection closed, reconnecting....');
                this.client.start()
            }
        }else if (connection === 'open') {
            console.log(chalk.blue('[SYS] : Succesfully Connected...'));
        } else if (connection === 'DisconnectReason.connectionClosed') {
            console.log(chalk.red('[SYS] :  Connection closed. retrying...')); this.client.start()
            store?.bind(this.client.sock.ev)};
            this.client.sock.ev.on('creds.update', () => saveState)}}