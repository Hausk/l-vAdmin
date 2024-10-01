import { db } from '~~/server/utils/db'

export default eventHandler(async () => {
  // List users for the current user
  const users = await db.query.users.findMany({})
  return users
})
