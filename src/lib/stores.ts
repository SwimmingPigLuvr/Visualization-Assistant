import { writable } from "svelte/store";
import { defaultSettings, type Message, type Settings } from "$lib/types";

export let userSettings = writable<Settings>(defaultSettings);

export let currentVoiceID = writable<string>('286VLndcKwmm1RxLQoOn');
export let currentThread = writable<string>('');
export let currentRun = writable<string>('');

export let userThreads = writable<string[]>([]);

export let wallpaper = writable<string>('/videos/clouds.mp4');
export let bgMode = writable<'image' | 'video'>('video');

export let responseText = writable<string>('');
export let partialMessage = writable<Message>({ content: '', role: 'assistant', id: 'partial_message', createdAt: new Date()});
export let completedMessage = writable<string>('');
export let messagesStore = writable<Message[]>([]);



export let userNameStore = writable<string>('');
export let userPfp = writable<string>('/pfps/field-aura.png');
export let assistantPfp = writable<string>('/pfps/gigaBubble.png');

export let isThinking = writable<boolean>(false);

export let v = writable<number>(0);

