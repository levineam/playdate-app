import { z } from 'zod';

// Family validation schemas
export const FamilySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateFamilySchema = FamilySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Child validation schemas
export const ChildSchema = z.object({
  id: z.string().uuid(),
  family_id: z.string().uuid(),
  name: z.string().min(1).max(50),
  birth_date: z.string().date(),
  grade: z.string().optional(),
  interests: z.array(z.string()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateChildSchema = ChildSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Connection validation schemas
export const ConnectionSchema = z.object({
  id: z.string().uuid(),
  family_a: z.string().uuid(),
  family_b: z.string().uuid(),
  status: z.enum(['pending', 'connected', 'blocked']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Availability validation schemas
export const AvailabilityWindowSchema = z.object({
  id: z.string().uuid(),
  child_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  recurring: z.boolean(),
  day_of_week: z.number().min(0).max(6).optional(),
  specific_date: z.string().date().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateAvailabilitySchema = AvailabilityWindowSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Playdate event validation schemas
export const PlaydateEventSchema = z.object({
  id: z.string().uuid(),
  organizer_family_id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  status: z.enum(['planned', 'confirmed', 'cancelled']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreatePlaydateEventSchema = PlaydateEventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Playdate invite validation schemas
export const PlaydateInviteSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  invited_family_id: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'declined']),
  message: z.string().max(300).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreatePlaydateInviteSchema = PlaydateInviteSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Auth/sign-in validation schemas
export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Type inference helpers
export type FamilyInput = z.infer<typeof CreateFamilySchema>;
export type ChildInput = z.infer<typeof CreateChildSchema>;
export type AvailabilityInput = z.infer<typeof CreateAvailabilitySchema>;
export type PlaydateEventInput = z.infer<typeof CreatePlaydateEventSchema>;
export type PlaydateInviteInput = z.infer<typeof CreatePlaydateInviteSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
