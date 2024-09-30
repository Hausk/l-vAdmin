import { db } from '~~/server/utils/db'

export default eventHandler(async () => {
  // List images for the current user
  const images = await db.query.images.findMany({})
  return images
})
