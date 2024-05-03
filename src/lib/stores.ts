import { writable } from "svelte/store";
import type { Message } from "$lib/types";

export let currentThread = writable<string>('');
export let currentRun = writable<string>('');

export let userThreads = writable<string[]>([]);

export let currentVoiceID = writable<string>('7Uw4vgM4Qb1qiwwUnu15');

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

