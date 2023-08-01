export interface Document {
    id: number;
    title: string;
    markdown: string;
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
