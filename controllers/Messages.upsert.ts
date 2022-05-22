
import { getContentType, isJidGroup, isJidStatusBroadcast, jidNormalizedUser } from "@adiwajshing/baileys"

import chalk from "chalk"
import moment from "moment-timezone"
import { Event } from "../models/Event"
 

export = class extends Event {
    constructor(client) {
        super(client, {
            name: 'messages.upsert'
        })
    }
  
    run = async (msg) => {
        if (!msg.messages) return
            const m = msg.messages[0]
            let sock = this.client.sock
            if (m.key && isJidStatusBroadcast(m.key.remoteJid)) return
            const from = m.key.remoteJid;
            let type = this.client.sock.msgType = getContentType(m.message);
          let t = this.client.sock.timestamp = m.messageTimestamp
            const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.listResponseMessage.singleSelectReply.selectedRowId || m.message.buttonsResponseMessage.selectedButtonId || m.text) : ''
let isGroupMsg = isJidGroup(m.chat)
            let sender = m.sender
            let pushname:string = sock.pushname = m.pushName
            const botNumber = jidNormalizedUser(this.client.sock.user.id)
            let groupMetadata= isGroupMsg ? global.store?.groupMetadata[m.chat] !== undefined ? global.store.groupMetadata[m.chat] : await global.store.fetchGroupMetadata(m.chat, sock) : {}
            let groupMembers = isGroupMsg ? groupMetadata.participants : []
            let groupAdmins = groupMembers.filter(v => v.admin !== null).map(x => x.id)
            let isGroupAdmin =  groupAdmins.includes(sender)
            let isBotGroupAdmin = groupAdmins.includes(botNumber)
            let formattedTitle = isGroupMsg ? groupMetadata.subject : ''
            const arg = body.trim().split(/ +/).slice(1);
        const messageContent = (m.message?.conversation ||  m.message?.extendedTextMessage?.text)
         if (messageContent) {
            const messageArgs = messageContent.split(' ')

            const [commandName, ...args] = messageArgs
            const command = this.client.commands.find((command) => command.name === (commandName));
            if (command) command.run(msg, args)
        }

    } 
}
