import { writable } from "svelte/store";
import type { Message } from "$lib/types";

export let currentVoiceID = writable<string>('286VLndcKwmm1RxLQoOn');
export let currentThread = writable<string>('');
export let currentRun = writable<string>('');

export let userThreads = writable<string[]>([]);

export let responseText = writable<string>('');
export let partialMessage = writable<Message>({ content: '', role: 'assistant', id: 'partial_message', createdAt: new Date()});
export let completedMessage = writable<string>('');
export let messagesStore = writable<Message[]>([]);

export interface Voice {
    name: string;
    id: string;
    imageURL: string;
}

export let userNameStore = writable<string>('');
export let userPfp = writable<string>('/pfps/field-aura.png');
export let assistantPfp = writable<string>('/pfps/gigaBubble.png');

export let isThinking = writable<boolean>(false);

