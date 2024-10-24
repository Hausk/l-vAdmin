import { useValidatedBody, z } from 'h3-zod'
import { users } from '~~/server/database/schema'
import { db } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const { email, name } = await useValidatedBody(event, {
    email: z.string().min(5).toLowerCase(),
    name: z.string().toLowerCase()
  })

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tu dois renseigner un email'
    })
  }
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tu dois renseigner un nom'
    })
  }
  try {
    // Insert todo for the current user
    const account: any = await db.insert(users).values({
      email,
      name,
      createdAt: new Date()
    }).returning()

    return account
  } catch (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating user'
    })
  }
})
