import { AnyMessageContent, getContentType, isJidGroup, jidNormalizedUser, MiscMessageGenerationOptions, proto } from "@adiwajshing/baileys"
import chalk from "chalk"
import { Event } from "../base/Event"

module.exports =class extends Event {
    constructor(client) {
        super(client, {
            name: 'messages.upsert'
        })
    }

    
    public args: string[] = [];
    public flags: string[] = [];
   
    
    run = async (m,) => {


        let type  = getContentType(m.message);
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        const args = body.trim().split(/ +/).slice(1)
        const sock = this.client.sock
        const msg = m.messages[0]
       
        let from = msg.key.remoteJid!
        let sender = m.sender
        let pushname = m.pushName
        let isGroupMsg = isJidGroup(from)
        let groupId = isGroupMsg ? from : ''
      let groupMetadata = isGroupMsg ? await sock.groupMetadata(groupId) : {}
       /*   let groupMembers = isGroupMsg ? groupMetadata.participants : []
        let groupAdmins = groupMembers.filter(v => v.admin !== null).map(x => x.id)
        let isGroupAdmin = groupAdmins.includes(sender)*/
        let formattedTitle = isGroupMsg ? groupMetadata.subject : ''
        const prefix = '/'
        let isCmd = body.startsWith(prefix);
    
        const messageContent = (msg.message?.conversation ||  msg.message?.extendedTextMessage?.text)
       
        if (messageContent) {
            const messageArgs = messageContent.split(' ')
         
          const arg = body.substring(body.indexOf(' ') + 1)
         
          const [commandName,...args]  = messageArgs
          const command = this.client.commands.find((command) => command.name === (commandName));   
            if (command) command.run(msg,m,)
            const key = args.join(' ');
         
            let cmd =  body.slice(1).trim().split(/ +/).shift().toLowerCase() 
    if (!isGroupMsg) {
        console.log(chalk.yellow(`[DM] ~> from ` + pushname))
    }
    if (isGroupMsg) {
        console.log(chalk.cyanBright(`[CMD]~>${this.args} from `+ pushname +   '~>',formattedTitle ))
    }
    if (!isCmd && !isGroupMsg) {
        console.log(`[CMD] : ${key} ~> from` + chalk.blue(pushname)
    )}
    }}}