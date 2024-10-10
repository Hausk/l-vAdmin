import { defineEventHandler, readBody } from 'h3'
import { inArray } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ids } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Invalid or empty ids array')
  }

  const deletedUsers = await db.delete(users)
    .where(inArray(users.id, ids))
    .returning()

  return { deletedCount: deletedUsers.length }
})
