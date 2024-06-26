import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { defaultSettings, type Message, type Settings, type Thread } from "$lib/types";
import { Audio } from "openai/resources/index.mjs";

export let currentVoiceID = writable<string>('286VLndcKwmm1RxLQoOn');

export let globalAudioPlayer = writable<HTMLAudioElement>(new Audio());
export let audioSource = writable<string[]>([]);
export let isLoading = writable<boolean[]>([]);
export let isPlaying = writable<boolean[]>([]);

export let currentAudio = writable<Audio | null>(null);

export let showVoiceModal = writable<boolean>(false);

export let showPricingTable = writable<boolean>(false);
export let showStats = writable<boolean>(false);

export let accountType = writable<string>('free');

export let currentTechnique = writable<string>('visualization');
export let customInstruct = writable<string | null>(null);

export let inputFocused = writable<boolean>(false);

export let isMenuOpen = writable<boolean>(false);

export let userSettings = writable<Settings>(defaultSettings);

export let defaultVoiceID = writable<string>('286VLndcKwmm1RxLQoOn');
export let currentThread = writable<string>('');
export let currentRun = writable<string>('');

export let userThreads = writable<Thread[]>([]);
export let archivedThreads = writable<string[]>([]);

export let wallpaper = writable<string>('/videos/clouds.mp4');
export let bgMode = writable<'image' | 'video'>('video');

export let responseText = writable<string>('');
export let partialMessage = writable<Message>({ content: '', role: 'assistant', id: 'partial_message', createdAt: new Date()});
export let completedMessage = writable<string>('');
export let messagesStore = writable<Message[]>([]);


export let threadOptionIndex = writable<number | null>(null);

export let userNameStore = writable<string>('');
export let userPfp = writable<string>('/pfps/field-aura.png');
export let assistantPfp = writable<string>('/pfps/gigaBubble.png');

export let isThinking = writable<boolean>(false);

export let v = writable<number>(0);

export let signInModalOpen = writable(true);

