import { Client } from "@stomp/stompjs"

export function getStompClient() {
    return new Promise<Client>((resolve, reject) => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            onConnect: () => {
                resolve(client);
            },
        });
        client.activate();
    })
}