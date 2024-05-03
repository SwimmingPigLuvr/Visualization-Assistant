import type { RequestHandler } from "@sveltejs/kit";

type Client = {
    id: string;
    response: Response;
};

const clients: Set<Client> = new Set();

export async function GET() {
    const clientID = Date.now().toString();

    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    };
    const { writable, close } = new SveltekitWritable();

    const stream = new ReadableStream({
        start(controller) {
            // store the new client
            clients.add({ id: clientID, response: { writable, close } });

            // notify client that connection is open (optional)
            controller.enqueue(`event: connected\ndata: {"clientID": "${clientID}"}\n\n`);
        },
        cancel() {
            // clean up after client disconnects
            const client = [...clients].find(c => c.id === clientID);
            if (client) {
                clients.delete(client);
                client.response.close();
            }
        }
    });

    return new Response(stream, { headers });

}

function sendToAllClients(data: string) {
    clients.forEach(client => {
        client.response.writable.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}