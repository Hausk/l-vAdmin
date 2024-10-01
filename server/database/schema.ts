import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql)
// Create a pgTable that maps to a table in your DB

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull()
})

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  path: text('path').notNull(),
  uploadedAt: timestamp('uploadedAt').defaultNow().notNull(),
  categoryId: integer('category_id').notNull()
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  pinnedImageId: integer('pinned_image_id')
})

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  images: many(images),
  pinnedImage: one(images, {
    fields: [categories.pinnedImageId],
    references: [images.id]
  })
}))

export const imagesRelations = relations(images, ({ one }) => ({
  category: one(categories, {
    fields: [images.categoryId],
    references: [categories.id]
  })
}))
