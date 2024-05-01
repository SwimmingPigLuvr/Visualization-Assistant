export interface Event {
    id: string;
    object: string;
    created_at: number;
    metadata?: any;  // Specify more detailed types if possible
    tool_resources?: any;  // Specify more detailed types if possible
    content?: string;
    delta?: Delta;  // Define Delta if you have details on its structure
    role?: string;  // If this is part of the data structure
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

export type Events = Event[];
