import slugify from 'slugify'
import { categories } from '~~/server/database/schema'
import { db } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const body = await readBody(event)
  const { name } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  const slug = slugify(name, { lower: true })

  try {
    const [newCategory] = await db.insert(categories).values({
      name,
      slug
    }).returning()

    return newCategory
  } catch (error) {
    console.error('Error creating category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating category'
    })
  }
})
