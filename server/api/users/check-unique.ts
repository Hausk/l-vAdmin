import { defineEventHandler, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'le paramètre email est requis'
    })
  }

  const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase())).execute()

  return {
    available: existingUser.length === 0
  }
})
