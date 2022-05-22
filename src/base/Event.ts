export class Event {
    qr:string
    client: any
    name: string
   
    constructor(client, options) {
        this.client = client
        this.name = options.name
    }
}
