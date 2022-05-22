import express from 'express'
import http from 'http'
const app = express()
const httpServer = http.createServer(app)
import toBuffer from '@adiwajshing/baileys'
import {  humanFileSize } from './base/convertor'
import qrcode from 'qrcode'
import { resizeImage } from './base/convertor'
import chalk from 'chalk'
import { Event } from './base/Event'
import { imageSync } from 'qr-image'

export class Server {
    private app = express()

    constructor(private client: Event) {
        this.use('/', express.static('public'))
        this.use(
            '/wa',
            (req, res, next) => {
               
                const router = express.Router()
                router.get('/qr', (_, res) => {
                    if (!this.client.qr)
                        return void res.status(500).json({ error: 'Failed to generate QR code. Try again' })
                    res.type('image/png')
                    res.send(imageSync(this.client.qr))
                })
                return router
            })()
        
    }

    public use = this.app.use.bind(this.app)

    public get = this.app.get.bind(this.app)

    public post = this.app.post.bind(this.app)

    public listen = (...args: Parameters<typeof this.app.listen>): ReturnType<typeof this.app.listen> => {
        return this.app.listen(...args)
    }
}