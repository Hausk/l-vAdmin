import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import { sql } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '~~/server/utils/db'
import { categories, images, users } from '~~/server/database/schema'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const generateMonthRanges = () => {
  const ranges = []
  const today = new Date()

  for (let i = 0; i < 12; i++) {
    const monthStart = startOfMonth(subMonths(today, i))
    const monthEnd = endOfMonth(monthStart)
    ranges.push({ start: monthStart, end: monthEnd })
  }

  return ranges
}

export default defineEventHandler(async () => {
  try {
    const monthRanges = generateMonthRanges()
    const nowUsage = await cloudinary.api.usage()

    const imageCountsByMonth = await db
      .select({
        yearMonth: sql`TO_CHAR(DATE_TRUNC('month', ${images.uploadedAt}), 'YYYY-MM-DD')`.as('yearMonth'),
        count: sql`COUNT(*)`.as('count')
      })
      .from(images)
      .where(sql`${images.uploadedAt} >= ${monthRanges[11].start}`)
      .groupBy(sql`DATE_TRUNC('month', ${images.uploadedAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${images.uploadedAt})`)

    const timeline = monthRanges.map((range) => {
      const rangeStartStr = format(range.start, 'yyyy-MM-dd')
      const matchingCount = imageCountsByMonth.find(
        count => count.yearMonth === rangeStartStr
      )
      return {
        date: format(range.start, 'yyyy-MM'),
        resources: matchingCount ? Number(matchingCount.count) : 0
      }
    })

    const [categoriesLength, usersLength] = await Promise.all([
      db.select({ count: sql`COUNT(*)`.as('count') }).from(categories).then(result => Number(result[0].count)),
      db.select({ count: sql`COUNT(*)`.as('count') }).from(users).then(result => Number(result[0].count))
    ])

    return {
      timeline,
      totalImages: nowUsage.resources,
      storage: nowUsage.credits,
      totalCategories: categoriesLength,
      totalUsers: usersLength
    }
  } catch (error) {
    console.error('Error fetching image statistics:', error)
    throw createError({
      statusCode: 500,
      message: 'Unable to fetch image statistics.'
    })
  }
})
