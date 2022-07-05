import * as fs from 'fs'
import { Boom } from '@hapi/boom'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import P from 'pino'
import chalk from "chalk"
import CFonts from 'cfonts'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'
import yargs from 'yargs'
import { Client } from './client/Client'
import mongoose, { connect } from 'mongoose'
import { AuthenticationFromDatabase} from './base/auth'
import { Server } from './server'
import {config as Config} from 'dotenv'
Config()


const logger = MAIN_LOGGER.child({ })
logger.level = 'trace'

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it

export const config = {
    name: process.env.NAME || 'Bot',
    session: process.env.SESSION || 'SESSION',
    prefix: process.env.PREFIX || ':',
    mods: (process.env.MODS || '').split(', ').map((user) => `${user}@s.whatsapp.net`),
    PORT: Number(1234)
}  
    
let start = async () => {
   

    if (!process.env.MONGO_URI) {
        throw new Error('No MongoDB URI provided!')
    }
    await connect(process.env.MONGO_URI)
    console.log('Connected to the Database')
    const { useDatabaseAuth } = new AuthenticationFromDatabase(config.session)
    const { saveState, state, clearState } = await useDatabaseAuth()
    const logger = MAIN_LOGGER.child({ })
    logger.level = 'fatal'
    const START_TIME = Date.now();
    const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`Currently using WA v${version.join('.')}, is it Latest: ${isLatest}`)
    console.log( CFonts.say('Welcome to BNH by suijin' , {
        font: 'console',
        align: 'center',
        gradient: ['#DCE35B', '#45B649'],
        transitionGradient: true,
    }));
   
    const client = new Client({
    
        version: (await fetchLatestBaileysVersion()).version,
        printQRInTerminal: true,
        auth: state,
        logger: P({ level: 'fatal' }),
        browser: ['WhatsApp-bot', 'fatal', '1.0.0']
    })
    
    new Server(client)
   client.start()
    
    client.sock.ev.on('creds.update', () => saveState)
}

start()

