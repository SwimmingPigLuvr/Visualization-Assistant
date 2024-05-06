import { get } from "svelte/store";
import { responseText, messagesStore, currentThread, isThinking, currentRun, partialMessage, completedMessage } from "./stores";




export async function createAndRun(userInput: string) {
    isThinking.set(true);

    // userinput is the first message
    // messagesStore.update(messages => [...messages, {
    //     id: 'initial message',
    //     content: userInput,
    //     role: 'user',
    //     createdAt: new Date()
    // }]);

  
    try {
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
  
      const reader = response.body?.getReader() as ReadableStreamDefaultReader<Uint8Array>;
      let result = '';
  
      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;
  
        const chunk = new TextDecoder().decode(value);
        result += chunk;
  
        // Check if the chunk contains a complete SSE event
        const eventStart = chunk.indexOf('data: ');
        if (eventStart !== -1) {
          const eventEnd = chunk.indexOf('\n\n', eventStart);
          if (eventEnd !== -1) {
            const eventData = chunk.slice(eventStart + 6, eventEnd).trim();
            const event = JSON.parse(eventData);
  
            console.log('Event:', event); // Log the event for testing
  
            // Partial message
            if (event.event === 'thread.message.delta') {
                const delta = event.data.delta;

                // Ensure that delta.content array exists and is not empty
                if (delta.content && delta.content.length > 0 && delta.content[0].text) {
                    const newText = delta.content[0].text.value;
                    partialMessage.update(currentMessage => ({
                        ...currentMessage,
                        content: currentMessage.content + newText
                    }));
                }
            }
            // Completed message
            else if (event.event === 'thread.message.completed') {
              const message = event.data;
  
              // Update the $messagesStore with the completed message
              messagesStore.update(messages => [...messages, {
                id: message.id,
                content: message.content[0].text.value,
                role: 'assistant',
                createdAt: new Date()
              }]);

                //  clear partial message
                partialMessage.set({
                    id: '',
                    content: '',
                    role: 'assistant',
                });
            
            }
            // Thread ID
            else if (event.event === 'thread.created') {
              const threadID = event.data.id;
              currentThread.set(threadID || '');
            }
            // Run ID
            else if (event.event === 'thread.run.created') {
              const runID = event.data.id;
              currentRun.set(runID || '');
            }
          }
        }
      }
  
      console.log('Final response:', result);
      isThinking.set(false);
    } catch (error) {
      console.error('Error creating and running thread:', error);
      isThinking.set(false);
    }
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



export async function cancelRun(threadID: string, runID: string) {
    try {
        const response = await fetch(`/api/threads/${threadID}/runs/${runID}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            console.log('run cancelled');
            isThinking.set(false);
        } else {
            console.error('failed to cancel run: ', response.statusText);
        }
    } catch (error) {
        console.error('error during deletion: ', error);
    }
}

// export function extractMessages(events: Events): Message[] {
//     return events
//     .filter(event => event.object === 'thread.message' && event.content.length > 0)
//     .map(event => ({
//       id: event.id,
//       content: event.content.map(c => c.text.value).join(' '),
//       createdAt: new Date(event.created_at),
//       role: event.role as 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
//     }));
// }

// export function extractMessageValues(events: Events): string[] {
//     return events
//       .filter(event => event.content && event.content.length > 0)
//       .map(event => event.content
//         .map(content => content.text.value) // TypeScript understands content is TextContent
//         .join(' ')
//       );
// }


