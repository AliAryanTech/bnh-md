export class Command {
    client: any
    name: string
    description: string

    constructor(client, options) {
        this.client = client,
        this.name = options.name,
        this.description = options.description
    }
}