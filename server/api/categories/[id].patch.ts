import { defineEventHandler, readBody } from 'h3'
import slugify from 'slugify'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { categories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const id: string | undefined = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'id de la catégorie est requis'
    })
  }
  const body = await readBody(event)

  const slug = slugify(body.name, { lower: true })
  console.log(body)
  const updateCategory = await db.update(categories)
    .set({
      name: body.name,
      slug: slug
    })
    .where(eq(categories.id, parseInt(id as string)))
    .returning()

  if (updateCategory.length === 0) {
    throw new Error('Category not found')
  }

  return updateCategory[0]
})
