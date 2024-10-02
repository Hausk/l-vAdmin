// file: server/api/categories/check-name.ts
import { eq } from 'drizzle-orm'
import { categories } from '~~/server/database/schema'
import { db } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name as string

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name parameter is required'
    })
  }

  const existingCategory = await db.select().from(categories).where(eq(categories.name, name)).execute()

  return {
    available: existingCategory.length === 0
  }
})
