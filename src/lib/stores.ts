import { writable } from "svelte/store";

export let voiceID = writable<string>('7Uw4vgM4Qb1qiwwUnu15');

export interface Voice {
    name: string;
    id: string;
    imageURL: string;
}