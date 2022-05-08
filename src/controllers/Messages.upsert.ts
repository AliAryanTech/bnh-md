import { config } from "dotenv";

config();
import { isJidGroup } from "@adiwajshing/baileys"

import chalk from "chalk"
import moment from "moment-timezone"
import { Event } from "../models/Event"
 

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'messages.upsert'
        })
    }
  
    run = async (m) => {
        const msg = m.messages[0]
        const messageContent = (msg.message?.conversation ||  msg.message?.extendedTextMessage?.text)
        let from = msg.key.remoteJid!
        const sock = this.client.sock
        let sender = m.sender
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        const pushname = m.pushName || "No Name"
        let isGroupMsg = isJidGroup(from)
        let groupId = isGroupMsg ? from : ''
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
    
        // Group
        const isGroup=  m.chat.endsWith("@g.us");
        const groupMetadata = m.isGroup ? await m.groupMetadata(m.chat).catch(e => {}) : ''

        const groupName = isGroup ? groupMetadata.subject : ''
        const participants = isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const time = moment.tz('Asia/Kolkata').format('DD/MM HH:mm:ss')
  
        let isCmd = body.startsWith(this.client.prefix);
        

        if (messageContent) {
            const messageArgs = messageContent.split(' ')

            const [commandName, ...args] = messageArgs
            const command = this.client.commands.find((command) => command.name === (commandName));
            if (!isGroupMsg) {
                console.log(chalk.yellow(`[DM] ~> from ` + pushname))
            }
            if (isGroupMsg) {
                console.log(chalk.cyanBright(`[MSG]~>${args} from `+ pushname +   '~>',groupName ))
            }
            if (!isCmd && !isGroupMsg) {
                console.log(`[CMD] : ${args} ~> from` +pushname + chalk.blue(pushname)
            )}
            if (command) command.run(msg, args)
        }

    } 
}
