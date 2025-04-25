import { usersTable } from '@src/modules/auth/db/schema'
import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const clientsTable = pgTable(
  'clients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    phone: text('phone').notNull(),
    company: text('company'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('client_text_search_idx').on(table.name, table.email),
  ]
)

export const clientsRelations = relations(clientsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [clientsTable.userId],
    references: [usersTable.id],
  }),
}))

export const clientSchema = createSelectSchema(clientsTable)
export type ClientSchema = z.infer<typeof clientSchema>
