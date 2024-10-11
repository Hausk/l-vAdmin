import { sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { db } from '~~/server/utils/db'
import { categories, images } from '~~/server/database/schema'

export default eventHandler(async () => {
  try {
    const pinnedImages = alias(images, 'pinnedImages')
    const topCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        imageCount: sql`count(${images.id})`.as('imageCount'),
        pinnedImageUrl: sql`COALESCE(${pinnedImages.path}, '')`.as('pinnedImageUrl')
      })
      .from(categories)
      .leftJoin(images, sql`${categories.id} = ${images.categoryId}`)
      .leftJoin(
        pinnedImages,
        sql`${categories.pinnedImageId} = ${pinnedImages.id}`
      )
      .groupBy(categories.id, categories.name, pinnedImages.path)
      .orderBy(sql`count(${images.id}) DESC`)
      .limit(5)

    return {
      topCategories: topCategories.map(category => ({
        ...category,
        pinnedImageUrl: category.pinnedImageUrl || null
      }))
    }
  } catch (error) {
    console.error('Error fetching top categories:', error)
    throw createError({
      statusCode: 500,
      message: 'Unable to fetch top categories.'
    })
  }
})
