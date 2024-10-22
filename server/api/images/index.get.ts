import { db } from '~~/server/utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  // List images for the current user
  const images = await db.query.images.findMany({})
  return images
})
