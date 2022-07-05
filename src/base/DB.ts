import { Contact } from '@adiwajshing/baileys'
import {
    userSchema,
    groupSchema,
    contactSchema,
    sessionSchema,
    disabledCommandsSchema,
    TCommandModel,
    TGroupModel,
    TSessionModel,
    TUserModel,
    UserSchema,
    GroupSchema
} from '../DB'
import { Utils } from './util'


export class Database {
    public getUser = async (jid: string): Promise<TUserModel> =>
        (await this.user.findOne({ jid })) ||
        (await new this.user({ jid, tag: this.utils.generateRandomUniqueTag() }).save())

    public setExp = async (jid: string, experience: number): Promise<void> => {
        experience = experience + Math.floor(Math.random() * 25)
        await this.updateUser(jid, 'experience', 'inc', experience)
    }

    public updateBanStatus = async (jid: string, action: 'ban' | 'unban' = 'ban'): Promise<void> => {
        await this.updateUser(jid, 'banned', 'set', action === 'ban')
    }

    public updateUser = async (
        jid: string,
        field: keyof UserSchema,
        method: 'inc' | 'set',
        update: boolean | number | string
    ): Promise<void> => {
        await this.getUser(jid)
        await this.user.updateOne({ jid }, { [`$${method}`]: { [field]: update } })
    }

    public getGroup = async (jid: string): Promise<TGroupModel> =>
        (await this.group.findOne({ jid })) || (await new this.group({ jid }).save())

    public updateGroup = async (jid: string, field: keyof GroupSchema, update: boolean): Promise<void> => {
        await this.getGroup(jid)
        await this.group.updateOne({ jid }, { $set: { [field]: update } })
    }

    public getSession = async (sessionId: string): Promise<TSessionModel | null> =>
        await this.session.findOne({ sessionId })

    public saveNewSession = async (sessionId: string): Promise<void> => {
        await new this.session({ sessionId }).save()
    }

    public updateSession = async (sessionId: string, session: string): Promise<void> => {
        await this.session.updateOne({ sessionId }, { $set: { session } })
    }

    public removeSession = async (sessionId: string): Promise<void> => {
        await this.session.deleteOne({ sessionId })
    }

    private utils = new Utils()

    public user = userSchema

    public group = groupSchema

    public contact = contactSchema

    public session = sessionSchema

    public disabledCommands = disabledCommandsSchema
}
