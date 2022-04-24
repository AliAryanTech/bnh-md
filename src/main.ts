import * as fs from 'fs'
import { Client } from './client/Client';
import { Boom } from '@hapi/boom'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
const P = require('pino')






// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it

let start = async () => {
   
    const { state } = useSingleFileAuthState(`./src/sessions/sessions.json`)
    const {version}  = await fetchLatestBaileysVersion()
    
    const client = new Client({
        
        logger: P({ level: 'trace' }),
        printQRInTerminal: true,
        auth: state,
        version,
        });
    

    client.start()
}

start()
