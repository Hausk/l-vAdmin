import { inArray } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '~~/server/utils/db'
import { images } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { imageIds } = await readBody(event)

  if (!imageIds || !Array.isArray(imageIds)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image IDs are required and must be an array'
    })
  }

  try {
    const deletedImages = await db.delete(images)
      .where(inArray(images.id, imageIds))
      .returning()

    // Delete images from Cloudinary
    for (const image of deletedImages) {
      const publicId = image.path.split('/category_images/')[1].replace(/\.[^/.]+$/, '')
      if (publicId) {
        await cloudinary.uploader.destroy(`category_images/${publicId}`)
      }
    }

    return { success: true, deletedCount: deletedImages.length }
  } catch (error) {
    console.error('Error bulk deleting images:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error bulk deleting images'
    })
  }
})
