import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { responseText, messagesStore, currentThread, isThinking, currentRun, partialMessage, completedMessage, userThreads } from "./stores";
import { auth, db } from "./firebase";
import { get } from "svelte/store";

export function formatText(inputText: string) {
    let formattedText = inputText;
    
    // Replace double newlines with HTML line breaks
    formattedText = formattedText.replace(/\n\n/g, '<br><br>');

    // Replace Markdown-like bold syntax
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    return formattedText;
}

async function addThread(threadID: string) {
    userThreads.update(userThreads => [threadID, ...userThreads]);
    console.log('updated list of user threads: ', userThreads);
    console.log('newest thread', threadID);
}

export async function syncThreadData() {
    const currentUserThreads = get(userThreads);
    if (auth.currentUser) {
        console.log('Syncing thread data to Firestore', currentUserThreads);
        const userRef = doc(db, `users/${auth.currentUser.uid}`);
        await updateDoc(userRef, {
            threads: currentUserThreads
        });
    }
}

export async function createAndRun(userInput: string) {
    isThinking.set(true);

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
              addThread(threadID);
              syncThreadData();
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

export async function createMessage(userInput: string, threadID: string) {
    console.log("Thread ID:", threadID);
    console.log("User Input:", userInput);
    try {
        const response = await fetch('/api/threads/createMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadID: threadID,
                message: {
                    role: "user",
                    content: userInput,
                }
            })
        });

        if (response.ok) {
            const message = await response.json();
            console.log('message:', message);

            const messageID = message?.id;
            console.log('message id:', messageID);

            // Update the $messagesStore with the completed message
            messagesStore.update(messages => [...messages, {
                id: messageID,
                content: userInput,
                role: 'user',
                createdAt: new Date()
            }]);
        } else {
            console.error('failed to create message:', response.statusText);
        }
    } catch (error) {
        console.error('request failed', error);
    }
}

export async function run(threadID: string) {
    isThinking.set(true);

    try {
        const response = await fetch('/api/threads/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadID }),
        });

        if (response.body) {
            const reader = response.body.getReader();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                result += chunk;

                // Handle event
                const eventStart = chunk.indexOf('data: ');
                if (eventStart !== -1) {
                    const eventEnd = chunk.indexOf('\n\n', eventStart);
                    if (eventEnd !== -1) {
                        const eventData = chunk.slice(eventStart + 6, eventEnd).trim();
                        const event = JSON.parse(eventData);
                        console.log('Event:', event); // Log the event for testing


                        // start
                        // Partial message
                        if (event.event === 'thread.message.delta') {
                            const delta = event.data.delta;

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

                            // Clear partial message
                            partialMessage.set({
                                id: '',
                                content: '',
                                role: 'assistant',
                            });
                        }
                        // Run ID
                        else if (event.event === 'thread.run.created') {
                            const runID = event.data.id;
                            currentRun.set(runID || '');
                        }
                        // end


                    }
                }
            }

            console.log('Final response:', result);
        }
    } catch (error) {
        console.error('Error running thread:', error);
    } finally {
        isThinking.set(false);
    }
}

export async function getThreadMessages() {
    const threadID = get(currentThread);
    try {
        const response = await fetch('/api/threads/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadID })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const messages = result.body?.data.map((item: any) => ({
            id: item.id,
            content: item.content[0]?.text?.value, // Assuming text is always present and in position 0
            createdAt: new Date(item.created_at * 1000), // Convert UNIX timestamp to JavaScript Date object
            role: item.role as 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool' // Type casting to match Message type
        }));

        messages.reverse();
        console.log('Fetched and transformed messages:', messages);
        messagesStore.set(messages);
        
    } catch (error) {
        console.error('Error fetching thread messages:', error);
    }
}


export async function retrieveAndRun() {
    isThinking.set(true);
    console.log('from inside r and run');
    try {
        const response = await fetch('/api/threads/retrieveAndRun', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          });
        
        console.log(response);

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


