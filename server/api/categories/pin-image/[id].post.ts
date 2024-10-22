import { eq } from 'drizzle-orm'
import { categories } from '~~/server/database/schema'
import { db } from '~~/server/utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const categoryId = event.context.params?.id
  const { imageId } = await readBody(event)

  if (!categoryId || !imageId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID and Image ID are required'
    })
  }

  try {
    const [updatedCategory] = await db.update(categories)
      .set({ pinnedImageId: imageId })
      .where(eq(categories.id, parseInt(categoryId)))
      .returning()

    if (!updatedCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error pinning image:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error pinning image'
    })
  }
})
