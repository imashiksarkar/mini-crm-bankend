import { z } from 'zod'

export const createClientDto = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email'),
  phone: z.string({ required_error: 'Phone is required' }).trim().min(2),
  company: z.string().trim().min(2).optional(),
  notes: z.string().trim().min(2).optional(),
})

export const updateUserDto = createClientDto

export const getClientDetailsParamsDto = z.object({
  clientId: z.string({ required_error: 'Client ID is required' }).trim().min(2),
})

export const deleteClientParamsDto = getClientDetailsParamsDto

export const getClientDetailsQueryDto = z
  .object({
    as: z.enum(['admin']).optional(),
  })
  .transform((old) => ({ ...old, asAdmin: old.as === 'admin' }))

export const deleteClientQueryDto = getClientDetailsQueryDto

export type CreateClientDto = z.infer<typeof createClientDto>
export type UpdateClientDto = z.infer<typeof updateUserDto>
