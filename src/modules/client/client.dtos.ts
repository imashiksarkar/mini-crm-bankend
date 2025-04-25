import { z } from 'zod'

export const createClientDto = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email'),
  phone: z.string().trim().min(2),
  company: z.string().trim().min(2).optional(),
  notes: z.string().trim().min(2).optional(),
})

export type CreateClientDto = z.infer<typeof createClientDto>
