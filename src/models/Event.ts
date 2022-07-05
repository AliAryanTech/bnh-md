export class Event {
    client: any
    name: string

    constructor(client, options) {
        this.client = client
        this.name = options.name
    }
}