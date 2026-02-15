"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = exports.CreatePlaydateInviteSchema = exports.PlaydateInviteSchema = exports.CreatePlaydateEventSchema = exports.PlaydateEventSchema = exports.CreateAvailabilitySchema = exports.AvailabilityWindowSchema = exports.ConnectionSchema = exports.CreateChildSchema = exports.ChildSchema = exports.CreateFamilySchema = exports.FamilySchema = void 0;
const zod_1 = require("zod");
// Family validation schemas
exports.FamilySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(500).optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
exports.CreateFamilySchema = exports.FamilySchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Child validation schemas
exports.ChildSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    family_id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(50),
    birth_date: zod_1.z.string().date(),
    grade: zod_1.z.string().optional(),
    interests: zod_1.z.array(zod_1.z.string()).optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
exports.CreateChildSchema = exports.ChildSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Connection validation schemas
exports.ConnectionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    family_a: zod_1.z.string().uuid(),
    family_b: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['pending', 'connected', 'blocked']),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
// Availability validation schemas
exports.AvailabilityWindowSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    child_id: zod_1.z.string().uuid(),
    start_time: zod_1.z.string().datetime(),
    end_time: zod_1.z.string().datetime(),
    recurring: zod_1.z.boolean(),
    day_of_week: zod_1.z.number().min(0).max(6).optional(),
    specific_date: zod_1.z.string().date().optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
exports.CreateAvailabilitySchema = exports.AvailabilityWindowSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Playdate event validation schemas
exports.PlaydateEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    organizer_family_id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(200).optional(),
    start_time: zod_1.z.string().datetime(),
    end_time: zod_1.z.string().datetime(),
    status: zod_1.z.enum(['planned', 'confirmed', 'cancelled']),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
exports.CreatePlaydateEventSchema = exports.PlaydateEventSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Playdate invite validation schemas
exports.PlaydateInviteSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    event_id: zod_1.z.string().uuid(),
    invited_family_id: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['pending', 'accepted', 'declined']),
    message: zod_1.z.string().max(300).optional(),
    created_at: zod_1.z.string().datetime(),
    updated_at: zod_1.z.string().datetime(),
});
exports.CreatePlaydateInviteSchema = exports.PlaydateInviteSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
// Auth/sign-in validation schemas
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
});
