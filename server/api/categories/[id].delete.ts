import { eq } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { categories, images } from '~~/server/database/schema'
import { db } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const categoryId = event.context.params?.id

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    // Start a transaction
    await db.transaction(async (trx) => {
      // Get all images for the category
      const categoryImages = await trx.select().from(images).where(eq(images.categoryId, parseInt(categoryId)))

      // Delete images from Cloudinary
      for (const image of categoryImages) {
        const publicId = image.path.split('/category_images/')[1].replace(/\.[^/.]+$/, '')
        if (publicId) {
          await cloudinary.uploader.destroy(`category_images/${publicId}`)
        }
      }

      // Delete all images for the category
      await trx.delete(images).where(eq(images.categoryId, parseInt(categoryId)))

      // Delete the category
      const [deletedCategory] = await trx.delete(categories).where(eq(categories.id, parseInt(categoryId))).returning()

      if (!deletedCategory) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category not found'
        })
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting category'
    })
  }
})
