import { join } from 'path';
import { readdirSync } from 'fs';
import makeWASocket, { DisconnectReason, AnyMessageContent, WASocket } from '@adiwajshing/baileys';

export class Client {
    
    sock: WASocket
    options: object
    commands: object[]
    
  

    
    constructor(options: object) {
        this.options = options
        this.commands = []
        this.createCommands()
    }

    start() {        
        this.sock = makeWASocket(this.options)
        this.loadEvent()
    }

    createCommands() {
        const localPath: string = './src/commands'
        const path = readdirSync(localPath)
    
        for (const commandsPath of path) {
            const cmdFilePath = readdirSync(`${localPath}/${commandsPath}`)
    
            for (const cmdFile of cmdFilePath) {
                const commmandClass = require(join(process.cwd(), `${localPath}/${commandsPath}/${cmdFile}`))
                const newCommand = new (commmandClass)(this)
    
                this.commands.push(newCommand)
            }
        }
    }

    loadEvent() {
        const localPath: string = './src/controllers'
        const path = readdirSync(localPath)

        for (const file of path) {
            const eventClass = require(join(process.cwd(), `${localPath}/${file}`))
            const newEvent = new (eventClass)(this)

            this.sock.ev.on(newEvent.name, newEvent.run)
    }}}