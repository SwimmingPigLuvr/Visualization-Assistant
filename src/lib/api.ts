import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { responseText, messagesStore, currentThread, isThinking, currentRun, partialMessage, completedMessage, userThreads, currentTechnique, customInstruct } from "./stores";
import { auth, firestore } from "./firebase";
import { get } from "svelte/store";

export function formatText(inputText: string) {

    if (typeof inputText !== 'string') {
        console.error('expected inputtext to be a string');
        return '';
    }

    let formattedText = inputText;
    
    // double newlines with HTML line breaks
    formattedText = formattedText.replace(/\n\n/g, '<br><br>');

    // Markdown-like bold syntax
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Markdown-like heading syntax
    formattedText = formattedText.replace(/### (.+?)(\n|$)/g, '<h3>$1</h3>');


    return formattedText;
}

async function addThread(threadID: string) {
    userThreads.update(userThreads => [threadID, ...userThreads]);
}

export async function syncThreadData() {
    const currentUserThreads = get(userThreads);
    if (auth.currentUser) {
        const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
        await updateDoc(userRef, {
            threads: currentUserThreads
        });
    }
}

function setCustomInstructions() {
    const technique = get(currentTechnique);

    if (technique === 'affirm') {
        customInstruct.set("Your role is my affirmation assistant. An affirmation is a short statement. Create an affirmation based on the user's desired outcome. the affirmation will be in the present tense and will be a positive statement that assumes their desire is fulfilled");
    } else if (technique === 'meditate') {
        customInstruct.set("create a guided meditation that invites the user to first close their eyes. breathing in slowly, holding for a brief period, then breathing out slowly. each inhalation relaxes the user and is breathing in the feelings of their wish fulfilled right now in the present moment, each exhalation is letting go of the old emotions, thought patterns, behaviors that no longer serve them. instruct them to feel that the wish has been fulfilled. let them do this for awhile then guide them back to the present");
    } else if (technique === 'revise') {
        customInstruct.set(`You are an assistant helping users practice Neville Goddard's Revision Technique. Guide the user through the following steps:

    Review the Event: At the end of the day, reflect on an event that didn't go as desired. Observe it without judgment.

    Rewrite the Event: In your imagination, revise the event to match the desired outcome. Visualize it vividly.

    Enter SATS: Guide the user to a relaxed state akin to sleep (SATS):
        Find a comfortable position and relax the body.
        Close your eyes, take deep breaths, and release tension.
        Let thoughts slow down, allowing intrusive thoughts to pass by.
        Visualize the revised scene clearly, engaging all senses.
        Feel the satisfaction and relief as if the revised event really happened.
        Maintain focus, gently redirecting the mind if it wanders.

    Relive and Feel: Encourage the user to relive and emotionally engage with the revised event repeatedly until it feels real.

    Know it is Done: Guide the user to continue the process until they sense completion, knowing the revision is achieved.

Remind the user to practice this technique nightly to effectively reshape past events and positively influence future experiences.`);
    } else if (technique === 'visualize') {
        customInstruct.set(null);
    } else if (technique === 'remember') {
        customInstruct.set("Your role is to help users use the 'I Remember When' technique (taught by Neville Goddard) to shift their perception of current circumstances by imagining them as past events. Explain that this technique involves thinking of their current undesirable situation as something that happened in the past. Guide them to create statements starting with 'I remember when...' followed by the current situation, and then describe the desired outcome as if it is now the present. Encourage them to believe in the truth of their statements and to repeat them regularly while feeling the emotions of having already achieved the desired outcome.")
    } else if (technique === 'script') {
        customInstruct.set("Your role is to help users craft detailed, vivid, and emotionally engaging scripts about their desired future as if it has already happened. Explain that scripting involves writing a detailed story of their ideal future in the present tense, including emotions, sensory details, and specific events. Prompt them to describe a perfect day, a specific event, or how they feel in this ideal future. Encourage them to include all five senses and to read their script regularly while feeling the emotions as if the events are happening now.");
    }
}

export async function createAndRun(userInput: string) {
    isThinking.set(true);

    setCustomInstructions();
    const instructions = get(customInstruct);
    console.log("Sending Custom Instructions:", instructions);

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
          instructions: instructions,
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
  
      isThinking.set(false);
    } catch (error) {
      console.error('Error creating and running thread:', error);
      isThinking.set(false);
    }
}

export async function createMessage(userInput: string, threadID: string) {
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

            const messageID = message?.id;

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

    setCustomInstructions();
    const instructions = get(customInstruct);
    console.log("sending custom instructions:", instructions);

    try {
        const response = await fetch('/api/threads/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadID,
                instructions: instructions
            }),
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
        messagesStore.set(messages);
        
    } catch (error) {
        console.error('Error fetching thread messages:', error);
    }
}


export async function retrieveAndRun() {
    isThinking.set(true);
    try {
        const response = await fetch('/api/threads/retrieveAndRun', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          });
        

    } catch (error) {
        console.error('Error running existing thread:', error);
    }
    isThinking.set(false);
}



export async function cancelRun(threadID: string, runID: string) {
    try {
        const response = await fetch(`/api/threads/cancelRun`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadID: threadID,
                runID: runID
            })
        });

        if (response.ok) {
            isThinking.set(false);
        } else {
            console.error('failed to cancel run: ', response.statusText);
        }
    } catch (error) {
        console.error('error during cancellation: ', error);
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


