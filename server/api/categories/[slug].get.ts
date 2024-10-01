import { useValidatedParams } from 'h3-zod'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { categories } from '~~/server/database/schema'

export default eventHandler(async (event) => {
  const { slug } = await useValidatedParams(event, {
    slug: z.string()
  })

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      images: true
    }
  })

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }
  return category
})
