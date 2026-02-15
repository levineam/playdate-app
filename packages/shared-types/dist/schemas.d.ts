import { z } from 'zod';
export declare const FamilySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    phone?: string | undefined;
    city?: string | undefined;
    bio?: string | undefined;
}, {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    phone?: string | undefined;
    city?: string | undefined;
    bio?: string | undefined;
}>;
export declare const CreateFamilySchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone?: string | undefined;
    city?: string | undefined;
    bio?: string | undefined;
}, {
    name: string;
    email: string;
    phone?: string | undefined;
    city?: string | undefined;
    bio?: string | undefined;
}>;
export declare const ChildSchema: z.ZodObject<{
    id: z.ZodString;
    family_id: z.ZodString;
    name: z.ZodString;
    birth_date: z.ZodString;
    grade: z.ZodOptional<z.ZodString>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    family_id: string;
    birth_date: string;
    grade?: string | undefined;
    interests?: string[] | undefined;
}, {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    family_id: string;
    birth_date: string;
    grade?: string | undefined;
    interests?: string[] | undefined;
}>;
export declare const CreateChildSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    family_id: z.ZodString;
    name: z.ZodString;
    birth_date: z.ZodString;
    grade: z.ZodOptional<z.ZodString>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    name: string;
    family_id: string;
    birth_date: string;
    grade?: string | undefined;
    interests?: string[] | undefined;
}, {
    name: string;
    family_id: string;
    birth_date: string;
    grade?: string | undefined;
    interests?: string[] | undefined;
}>;
export declare const ConnectionSchema: z.ZodObject<{
    id: z.ZodString;
    family_a: z.ZodString;
    family_b: z.ZodString;
    status: z.ZodEnum<["pending", "connected", "blocked"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "pending" | "connected" | "blocked";
    family_a: string;
    family_b: string;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "pending" | "connected" | "blocked";
    family_a: string;
    family_b: string;
}>;
export declare const AvailabilityWindowSchema: z.ZodObject<{
    id: z.ZodString;
    child_id: z.ZodString;
    start_time: z.ZodString;
    end_time: z.ZodString;
    recurring: z.ZodBoolean;
    day_of_week: z.ZodOptional<z.ZodNumber>;
    specific_date: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    child_id: string;
    start_time: string;
    end_time: string;
    recurring: boolean;
    day_of_week?: number | undefined;
    specific_date?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    child_id: string;
    start_time: string;
    end_time: string;
    recurring: boolean;
    day_of_week?: number | undefined;
    specific_date?: string | undefined;
}>;
export declare const CreateAvailabilitySchema: z.ZodObject<Omit<{
    id: z.ZodString;
    child_id: z.ZodString;
    start_time: z.ZodString;
    end_time: z.ZodString;
    recurring: z.ZodBoolean;
    day_of_week: z.ZodOptional<z.ZodNumber>;
    specific_date: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    child_id: string;
    start_time: string;
    end_time: string;
    recurring: boolean;
    day_of_week?: number | undefined;
    specific_date?: string | undefined;
}, {
    child_id: string;
    start_time: string;
    end_time: string;
    recurring: boolean;
    day_of_week?: number | undefined;
    specific_date?: string | undefined;
}>;
export declare const PlaydateEventSchema: z.ZodObject<{
    id: z.ZodString;
    organizer_family_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    start_time: z.ZodString;
    end_time: z.ZodString;
    status: z.ZodEnum<["planned", "confirmed", "cancelled"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "planned" | "confirmed" | "cancelled";
    start_time: string;
    end_time: string;
    organizer_family_id: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "planned" | "confirmed" | "cancelled";
    start_time: string;
    end_time: string;
    organizer_family_id: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
}>;
export declare const CreatePlaydateEventSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    organizer_family_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    start_time: z.ZodString;
    end_time: z.ZodString;
    status: z.ZodEnum<["planned", "confirmed", "cancelled"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    status: "planned" | "confirmed" | "cancelled";
    start_time: string;
    end_time: string;
    organizer_family_id: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
}, {
    status: "planned" | "confirmed" | "cancelled";
    start_time: string;
    end_time: string;
    organizer_family_id: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
}>;
export declare const PlaydateInviteSchema: z.ZodObject<{
    id: z.ZodString;
    event_id: z.ZodString;
    invited_family_id: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "declined"]>;
    message: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "pending" | "accepted" | "declined";
    event_id: string;
    invited_family_id: string;
    message?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "pending" | "accepted" | "declined";
    event_id: string;
    invited_family_id: string;
    message?: string | undefined;
}>;
export declare const CreatePlaydateInviteSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    event_id: z.ZodString;
    invited_family_id: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "declined"]>;
    message: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    status: "pending" | "accepted" | "declined";
    event_id: string;
    invited_family_id: string;
    message?: string | undefined;
}, {
    status: "pending" | "accepted" | "declined";
    event_id: string;
    invited_family_id: string;
    message?: string | undefined;
}>;
export declare const SignInSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type FamilyInput = z.infer<typeof CreateFamilySchema>;
export type ChildInput = z.infer<typeof CreateChildSchema>;
export type AvailabilityInput = z.infer<typeof CreateAvailabilitySchema>;
export type PlaydateEventInput = z.infer<typeof CreatePlaydateEventSchema>;
export type PlaydateInviteInput = z.infer<typeof CreatePlaydateInviteSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
