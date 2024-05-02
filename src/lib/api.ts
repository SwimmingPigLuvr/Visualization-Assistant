import { messagesStore, currentThread, isThinking } from "./stores";
import type { Events, Message } from "$lib/types";

export async function createAndRun(userInput: string): Promise<void> {
    isThinking.set(true);
        try {
            // await response
            const response = await fetch('/api/threads/createAndRun', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: {
                        role: 'user',
                        content: userInput,
                    },
                }),
            });

            // get data as events
            const data = await response.json() as { events: Events };

            // get new threadID && set thread store
            const threadID = data?.events[0]?.id; 
            currentThread.set(threadID || '');

            // extract messages && set messages store
            const messages = extractMessages(data.events);
            
            messagesStore.set(messages);
            
        } catch (error) {
            console.error('err creating and running thread: ', error);
        }
        
        isThinking.set(false);

}

export async function retrieveAndRun(threadID: string, userInput: string) {
    isThinking.set(true);
    try {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadID}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                thread_id: threadID,
                message: {
                    role: 'user',
                    content: userInput,
                }
            }),
        });

        const data = await response.json();
        const messages = data.messages || [];
        messagesStore.set(messages);
    } catch (error) {
        console.error('Error running existing thread:', error);
    }
    isThinking.set(false);
}

export function extractMessages(events: Events): Message[] {
    return events
    .filter(event => event.object === 'thread.message' && event.content.length > 0)
    .map(event => ({
      id: event.id,
      content: event.content.map(c => c.text.value).join(' '),
      createdAt: new Date(event.created_at),
      role: event.role as 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
    }));
}

export function extractMessageValues(events: Events): string[] {
    return events
      .filter(event => event.content && event.content.length > 0)
      .map(event => event.content
        .map(content => content.text.value) // TypeScript understands content is TextContent
        .join(' ')
      );
}
