

export interface ProblemData {
    problemType: string;
    section: string;
    documentType: string;
    sourceMaterial: string;
}

export interface ChunkInstructionProblem {
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
}
export interface IPost {
    id: number;
    title: string;
    body: string;
    author: string;
    date: string;
}


export interface ITool {
    id: number;
    title: string;
    description: string;
    enabled?: boolean;
    imageUrl: string;
    linkUrl?: string;
}

export type Rating = 'thumbsUp' | 'thumbsDown' | "";

export interface IFeedbackData {
    toolName: string;
    responseText: string | null;
    rating: Rating;
    userFeedback: string;
    data: ProblemData | ChunkInstructionProblem | null
}

export interface ISubscriptionData {
    email: string;
    newToolReleases: boolean;
    aiNewsletter: boolean;
    blogPosts: boolean;
    consentGiven: boolean;
    consentTimestamp: string;
    consentText: string;
    consentIp: string;
}
export interface ISubscriptionDataSnake {
    email: string;
    new_tool_releases: boolean;
    ai_newsletter: boolean;
    blog_posts: boolean;
    consent_given: boolean;
    consent_timestamp: string;
    consent_text: string;
    consent_ip: string;
}

export interface Message {
    text: string;
    plotlyData?: any;
    images?: string[]; // assuming images are URLs to the images
}

export type IChatData = {
    sessionId: string;
    messages: Message[];
};

export interface IRestaurant {
    name: string;
    contact: string;
    website: string;
    address: string;
    selectionReason: string;
}
export interface Section {
    Concept: string;
    ConceptNote: string;
    SkillFocus: any;
    LearningObjectives: any;
    SampleActivity: string;
}

// new interfaces for the new document format

export const CHUNK_TYPE = "chunk" as const; // so that typescript doesn't complain about type string not being type "chunk"
export const INSTRUCTION_TYPE = "instruction" as const;
export const PROBLEM_TYPE = "problem" as const;

//
export const CHUNK_DRAG_TYPE = "MATH_CHUNK" as const; // so that typescript doesn't complain about type string not being type "chunk"
export const INSTRUCTION_DRAG_TYPE = "MATH_INSTRUCTION" as const;
export const PROBLEM_DRAG_TYPE = "MATH_PROBLEM" as const;

export interface Document {
    id?: number;
    title: string;
    creator?: string;
    contributors: string[]; // Array of contributors
    upvotes: number;
    tips: number;
    last_modified_by: string;
    created_at: string; // Using string for simplicity, consider using a date/time library like day.js or luxon for better date/time handling
    updated_at: string; // Same as above
    section: string;
    chapter: string;
    documentType?: string;
    problemChunks?: Chunk[];
    shared?: boolean;
}


export interface Chunk {
    id?: number;
    mongoChunkId?: string;
    type: "chunk";
    content: (Instruction | Problem)[];
}

export interface Instruction {
    type: "instruction";
    content: (Text | Math | Table | Image)[];
}

export interface Problem {
    type: "problem";
    content: (Text | Math | Table | Image)[];
}

export interface Text {
    type: "text";
    value: string;
}

export interface Math {
    type: "math";
    value: string;
}

export interface Image {
    type: "image";
    value: string;
}

export interface Table {
    type: "table";
    content: (Math | Text)[];
}
