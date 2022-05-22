import * as fs from 'fs'
import { Client } from './client/Client';
import { Boom } from '@hapi/boom'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import P from 'pino'
import chalk from "chalk"
import CFonts from 'cfonts'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'
import yargs from 'yargs'

let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
let session;
 if (opts['server']) require('./server')
if (opts['server']) {
    session = './session.json'
} else {
    session = './session.json'
}

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it

let start = async () => {
    const logger = MAIN_LOGGER.child({ })
    logger.level = 'silent'
    const START_TIME = Date.now();
    const { state,saveState } = useSingleFileAuthState(session)
    const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`Currently using WA v${version.join('.')}, is it Latest: ${isLatest}`)
    
    console.log( CFonts.say('Welcome to BNH by suijin' , {
        font: 'console',
        align: 'center',
        gradient: ['#DCE35B', '#45B649'],
        transitionGradient: true,
    }));

    const client = new Client({
        
        logger,
        printQRInTerminal: true,
        browser: ['BNH','Safari','1.0.0'],
        auth: state,
        version,
        });
    
       
      
    client.start()
    }

start()


