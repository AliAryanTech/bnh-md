import {MessageType, proto, WAMessage} from '@adiwajshing/baileys'

export interface IUser {
    username: string
    jid: string
}
export type JID = `${string}@s.whatsapp.net`

/** Whatsapp Group ID */
export type GID = `${string}-${string}@g.us`

class Message {
    public supportedMediaMessages = new Array<MessageType>('imageMessage', 'videoMessage')

    public content: string


    public mentioned = new Array<string>()

    public sender: IUser

    public quoted?: {
        sender: IUser
        message: proto.IMessage
    }

    public urls = new Array<string>()

    public readonly isAdminMessage = false
       
private M :WAMessage
    get raw(): WAMessage {
        return this.M
    }

    get chat(): 'group' | 'dm' {
        return this.from.endsWith('g.us') ? 'group' : 'dm'
    }

    get from(): JID | GID | string {
        return this.M.key.remoteJid as string
    }
}

export default Message

