import * as fs from 'fs'
import { Client } from './client/Client';
import { Boom } from '@hapi/boom'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import P from 'pino'
import chalk from "chalk"
import CFonts from 'cfonts'


// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it

let start = async () => {
 

    const { state,saveState } = useSingleFileAuthState(`./src/sessions/sessions.json`)
    const {version}  = await fetchLatestBaileysVersion()
    
    
    console.log( CFonts.say('Welcome to BNH by suijin' , {
        font: 'console',
        align: 'center',
        gradient: ['#DCE35B', '#45B649'],
        transitionGradient: true,
    }));

    const client = new Client({
        
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        version,
        });
    
        client.sock.ev.on('creds.update', saveState)

    client.start()
    }

start()


