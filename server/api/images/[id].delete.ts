import { eq } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '~~/server/utils/db'
import { images } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }

  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image ID is required'
    })
  }

  try {
    const [deletedImage] = await db.delete(images).where(eq(images.id, parseInt(id))).returning()

    if (!deletedImage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      })
    }

    // Delete image from Cloudinary
    const publicId = deletedImage.path.split('/category_images/')[1].replace(/\.[^/.]+$/, '')
    if (publicId) {
      await cloudinary.uploader.destroy(`category_images/${publicId}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression'
    })
  }
})
