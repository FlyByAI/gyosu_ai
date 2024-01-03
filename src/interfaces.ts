import { IChatMessage } from "./pages/GyosuAIChat";

export interface GenerateFormData {
    data: TextbookProblemData | CompetitionData;
}

export interface TextbookProblemData {
    problemType: string;
    chapter: string;
    section: string;
    documentType: string;
    sourceMaterial: string;
}

export interface CompetitionData {
    problemType: string;
    level: string;
}

export interface ProblemData {
    problemType: string;
    chapter: string;
    section: string;
    documentType: string;
    sourceMaterial: string;
}

export interface ChunkInstructionProblem {
    chunkId?: number;
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

export interface IFeedbackData extends ChunkInstructionProblem {
    feedbackLabel: string;
    rating: Rating;
    userFeedback: string;
    issueResponses: Array<FeedbackQuestion>;
}

interface FeedbackQuestion {
    question: string;
    response: Rating | "yes" | "no";
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

export type IChatData = {
    sessionId: string;
    messages: IChatMessage[];
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
    upvotes?: number;
    tips?: number;
    lastModifiedBy: string;
    createdAt: string; // Using string for simplicity, consider using a date/time library like day.js or luxon for better date/time handling
    updatedAt: string; // Same as above
    documentType?: string;
    problemChunks?: Chunk[];
    shared?: boolean;
}

export interface Source {
    book: string,
    chapter: string,
    section: string,
    problemType: string
}

export interface EmptyDocument {
    problemChunks?: Chunk[];
}


export interface Chunk {
    id?: number;
    parentId?: number;
    mongoChunkId?: string;
    chunkId?: string;
    type: "chunk";
    content: (Instruction | Problem)[];
    source?: Source;
}

export interface Instruction {
    type: typeof INSTRUCTION_TYPE;
    content: (Text | Math | Table | Image | Subproblems)[];
    instructionId?: number;
}

export interface Problem {
    type: typeof PROBLEM_TYPE;
    content: (Text | Math | Table | Image | Subproblems)[];
    problemId?: number;
}

export interface Subproblems {
    type: "subproblems";
    content: (Subproblem)[];
}

export interface Subproblem {
    type: "subproblem";
    label: string;
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
    value: string;
    content: (Text | Math | Image)[];
}
