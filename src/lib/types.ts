import type { Annotation } from "openai/resources/beta/threads/messages.mjs";

export interface Thread {
    name?: string;
    id: string;
    archived: boolean;
    favorite: boolean;
}

export interface Event {
    id: string;
    object: string;
    created_at: number;
    metadata?: any;
    tool_resources?: any;
    content?: string;
    delta?: Delta;
    role?: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt?: Date;
    role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
}

// export interface MessageEvent {
//     [x: string]: string;
//     id: string;
//     created_at: Date;
//     content: TextContent[];
//     role?: string;
// }

export interface TextContent {
    text: {
        value: string;
        annotations?: Annotation[];
    };
    type: string;
}

export interface Delta {
    content: ContentDelta[];
}

export interface ContentDelta {
    index: number;
    text: {
        value: string;
        annotations?: any[];  // Define a more specific type if possible
    };
    type: string;
}

// export type Events = MessageEvent[];

export interface Settings {
    voiceID: string,
}

export const defaultSettings: Settings = {
    voiceID: '286VLndcKwmm1RxLQoOn'
}

export interface Voice {
    name: string;
    id: string;
    imageURL: string;
    audioPreviewURL: string;
}
