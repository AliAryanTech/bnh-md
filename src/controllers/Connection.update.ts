import { Boom } from '@hapi/boom'
import { Event } from "../models/Event"
import { DisconnectReason, ConnectionState, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys/lib'
import chalk from 'chalk'
import pino from 'pino'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'
const qr = require('qr-image')
import {config} from '../main'
import { AuthenticationFromDatabase } from '../base/auth'

export = class extends Event {
    
    QR: Buffer
    condition: string
    constructor(client) {
        super(client, {
            name: 'connection.update'
        })
    }

    run = async (update: ConnectionState) => {
        // THIS IS FOR SERVER   
        const { useDatabaseAuth } = new AuthenticationFromDatabase(config.session)
const { saveState, state, clearState } = await useDatabaseAuth()
        if (update.qr) {
            console.log(
                `QR code generated. Scan it to continue | You can also authenicate in http://localhost:${config.PORT}`
            )
            this.QR = qr.imageSync(update.qr)
        }
        
      const { connection, lastDisconnect } = update
            if (connection === 'close') {
                if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                    console.log('Reconnecting...')
                    setTimeout(() => this.client.start(), 3000)
                } else {
                    console.log('Disconnected.', true)
                    console.log('Starting...')
                    setTimeout(() => this.client.start(), 3000)
                }
            }
            if (connection === 'connecting') {
                this.condition = 'connecting'
                console.log('Connecting to WhatsApp...')
            }
            if (connection === 'open') {
                this.condition = 'connected'
                console.log('Connected to WhatsApp')
            }
        }}