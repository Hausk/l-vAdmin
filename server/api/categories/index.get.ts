import { db } from '~~/server/utils/db'

export default eventHandler(async () => {
  // List categories for the current user
  const categories = await db.query.categories.findMany({
    with: {
      pinnedImage: {
        columns: {
          path: true
        }
      }
    }
  })
  return categories
})
