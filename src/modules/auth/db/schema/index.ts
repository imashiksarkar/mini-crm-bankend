import { projectsTable } from '@src/modules/project/db/schema'
import { relations } from 'drizzle-orm'
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])

export const usersTable = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    role: userRoleEnum('role').array().notNull().default(['user']),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('email_idx').on(table.email)]
)

export const tokensTable = pgTable(
  'tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('token_idx').on(table.token),
    index('user_id_idx').on(table.userId),
  ]
)

export const usersRelations = relations(usersTable, ({ many }) => ({
  tokens: many(tokensTable),
  projects: many(projectsTable),
}))

export const tokensRelations = relations(tokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [tokensTable.userId],
    references: [usersTable.id],
  }),
}))

const userSchema = createSelectSchema(usersTable)
export type UserSchema = z.infer<typeof userSchema>
