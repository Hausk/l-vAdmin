import { db } from '~~/server/utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  // List users for the current user
  const users = await db.query.users.findMany({})
  return users
})
