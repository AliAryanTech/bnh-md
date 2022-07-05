
import Message from "../../client/Message";
import { Command } from "../../models/Command";

export = class extends Command {
    constructor(client) {
        super(client, {
            name: 'hi',
            description: 'Return hello'
        });
    };

    run = async (M:Message) => {
        const sock = this.client.sock

        const sections = [
            {
            title: "Select your hello",
            rows: [
                {title: "Hello", rowId: "option1"},
                {title: "Hi", rowId: "option2", description: "Simple hi"}
            ]
            },
           {
            title: "Section 2",
            rows: [
                {title: "Option 3", rowId: "option3"},
                {title: "Option 4", rowId: "option4", description: "This is a description V2"}
            ]
            },
        ]

        const listMessage = {
            text: 'Hello',
            footer: 'Message sent from: whatsapp-bot',
            title: 'Menu hello',
            buttonText: 'Text on the button to view the list',
            sections
        }

        sock.sendMessage(M.from, listMessage);
    }
}