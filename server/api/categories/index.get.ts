import { db } from '~~/server/utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const categories = await db.query.categories.findMany({
    with: {
      pinnedImage: {
        columns: {
          path: true
        }
      }
    }
  })
  return categories
})
