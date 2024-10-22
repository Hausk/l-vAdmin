import { v2 as cloudinary } from 'cloudinary'
import { db } from '~~/server/utils/db'
import { images } from '~~/server/database/schema'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non autorisé'
    })
  }
  const body = await readMultipartFormData(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const file = body.find(part => part.name === 'file')
  const categoryId = body.find(part => part.name === 'categoryId')?.data.toString()

  if (!file || !categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File and categoryId are required'
    })
  }

  try {
    // Upload to Cloudinary
    const cloudinaryUpload: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'category_images' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(file.data)
    })

    // @ts-expect-ignore (TypeScript might complain about the type of cloudinaryUpload)
    const imageUrl = cloudinaryUpload.secure_url

    // Save image info to database
    const [newImage] = await db.insert(images).values({
      path: imageUrl,
      categoryId: parseInt(categoryId)
    }).returning()

    return newImage
  } catch (error) {
    console.error('Error uploading image:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error uploading image'
    })
  }
})
