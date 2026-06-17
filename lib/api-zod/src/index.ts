import { z } from 'zod';

export const EventTypeSchema = z.enum([
  'TICKET_CREATE',
  'TICKET_CLOSE',
  'TICKET_ASSIGN',
  'CONSOLE_ERROR',
  'BROADCAST',
  'JOIN',
]);

export const EventSchema = z.object({
  id: z.number(),
  type: EventTypeSchema,
  serverName: z.string(),
  payload: z.record(z.any()),
  createdAt: z.string(),
});

export const TicketSchema = z.object({
  ticketId: z.string(),
  playerName: z.string(),
  category: z.string(),
  description: z.string(),
  status: z.enum(['open', 'closed']),
  createdAt: z.string(),
});

export const ErrorSchema = z.object({
  message: z.string(),
  stackTrace: z.string(),
  createdAt: z.string(),
});

export const DashboardSummarySchema = z.object({
  openTickets: z.number(),
  errors: z.number(),
  totalEvents: z.number(),
});

export const AuthVerifyRequestSchema = z.object({
  apiKey: z.string(),
});

export const AuthVerifyResponseSchema = z.object({
  valid: z.boolean(),
  role: z.enum(['admin', 'staff']).nullable(),
});
