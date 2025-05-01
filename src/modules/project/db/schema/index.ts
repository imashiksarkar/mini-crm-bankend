import { usersTable } from '@src/modules/auth/db/schema'
import { clientsTable } from '@src/modules/client/db/schema'
import { relations } from 'drizzle-orm'
import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const projectStatusEnum = pgEnum('project_status', [
  'idle',
  'in-progress',
  'finished',
])

export const projectsTable = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id')
    .references(() => clientsTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  budget: integer('budget').notNull(),
  deadline: timestamp('deadline').notNull(),
  status: projectStatusEnum('status').default('idle').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const projectsRelations = relations(projectsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [projectsTable.userId],
    references: [usersTable.id],
  }),
  client: one(clientsTable, {
    fields: [projectsTable.clientId],
    references: [clientsTable.id],
  }),
}))

export const projectSchema = createSelectSchema(projectsTable)
export type ProjectSchema = z.infer<typeof projectSchema>
