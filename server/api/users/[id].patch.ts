import { defineEventHandler, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id: string | undefined = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'id de l\'utilisateur est requis'
    })
  }
  const body = await readBody(event)

  const updatedUser = await db.update(users)
    .set({
      email: body.email.toLowerCase(),
      name: body.name.toLowerCase()
    })
    .where(eq(users.id, parseInt(id as string)))
    .returning()

  if (updatedUser.length === 0) {
    throw new Error('User not found')
  }

  return updatedUser[0]
})
