import { pgTable, varchar, text, uuid, pgEnum, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

const cortexTypeEnum = pgEnum('cortex_type', [
  'youtube',
  'papers', 
  'twitter',
  'articles',
  'github-repo',
  'code_snippet',
  'documentation',
  'design_inspiration',
  'stackoverflow',
  'tutorial',
  'website',  
  'other'     
]);

export const languageEnum = pgEnum('language_type', [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'html',
  'css',
  'sql',
  'other'
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: varchar('google_id', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }),
  authType: varchar('auth_type', { length: 20 }).notNull().default('email'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const cortex = pgTable('cortex', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: cortexTypeEnum('type').notNull(),
  tags: jsonb('tags').default([]),
  link: varchar('link', { length: 500 }).notNull(),  // Fixed column name
  title: varchar('title', { length: 500 }).notNull(), // Fixed column name
  description: text('description'),
  language: languageEnum('language'),
  content: text('content'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const shares = pgTable('shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  hash: varchar('hash', { length: 64 }).unique().notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export type User = typeof users.$inferInsert;
export type Cortex = typeof cortex.$inferInsert;
export type Share = typeof shares.$inferInsert;