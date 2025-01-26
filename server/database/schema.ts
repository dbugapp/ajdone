import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'
import type { GoogleUserInfo, GithubUserInfo, TokenLocation } from '~/types/auth'

export const schemaTimestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
}

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  ...schemaTimestamps,
})

export const providers = sqliteTable('providers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  avatar: text('avatar'),
  payload: text('payload', { mode: 'json' }).notNull().$type<GoogleUserInfo | GithubUserInfo>(),
  ...schemaTimestamps,
}, t => [index('unq').on(t.userId, t.name)])

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}))

export const tokens = sqliteTable('tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  hash: text('hash').notNull().unique(),
  source: text('source').notNull(),
  ip: text('ip').notNull(),
  agent: text('agent').notNull(),
  location: text('location', { mode: 'json' }).notNull().$type<TokenLocation>(),
  coordinate: text('coordinate', { mode: 'json' }).notNull().$type<{ lat: number, lon: number }>()
    .default(sql`('{"lat":30.2423,"lon":-97.7672}')`),
  ...schemaTimestamps,
})
export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}))
