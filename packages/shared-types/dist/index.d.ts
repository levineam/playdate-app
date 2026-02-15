export interface Family {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    bio?: string;
    created_at: string;
    updated_at: string;
}
export interface Child {
    id: string;
    family_id: string;
    name: string;
    birth_date: string;
    grade?: string;
    interests?: string[];
    created_at: string;
    updated_at: string;
}
export interface Connection {
    id: string;
    family_a: string;
    family_b: string;
    status: 'pending' | 'connected' | 'blocked';
    created_at: string;
    updated_at: string;
}
export interface AvailabilityWindow {
    id: string;
    child_id: string;
    start_time: string;
    end_time: string;
    recurring: boolean;
    day_of_week?: number;
    specific_date?: string;
    created_at: string;
    updated_at: string;
}
export interface PlaydateEvent {
    id: string;
    organizer_family_id: string;
    title: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time: string;
    status: 'planned' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}
export interface PlaydateInvite {
    id: string;
    event_id: string;
    invited_family_id: string;
    status: 'pending' | 'accepted' | 'declined';
    message?: string;
    created_at: string;
    updated_at: string;
}
export interface APIResponse<T = any> {
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
export * from './schemas';
