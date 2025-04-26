import { z } from 'zod'
import { projectStatusEnum } from './db/schema'

export const createProjectDto = z.object({
  clientId: z.string({ required_error: 'Client ID is required' }).trim().min(2),
  title: z.string({ required_error: 'Title is required' }).trim().min(2),
  budget: z.number().min(10),
  deadline: z.coerce
    .date()
    .refine((date) => date > new Date(), 'Deadline must be in the future'),
  status: z.enum(projectStatusEnum.enumValues).default('idle').optional(),
})

export type CreateProjectDto = z.infer<typeof createProjectDto>
