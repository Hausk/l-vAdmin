import { Readable } from 'stream'
import { defineEventHandler, readMultipartFormData } from 'h3'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '~~/server/utils/db'
import { images } from '~~/server/database/schema'

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body) {
    return { error: 'Aucun fichier à Upload' }
  }
  const file = body.find((item: any) => item.name === 'image')
  if (!file || !file.data) {
    return { error: `Aucune image valide n'est présente.` }
  }
  const categoryIdField = body.find((item: any) => item.name === 'categoryId')
  if (!categoryIdField || !categoryIdField.data) {
    return { error: 'ID de catégorie manquant dans le formulaire.' }
  }

  // Convertir la valeur binaire en texte
  const categoryId = Buffer.from(categoryIdField.data).toString('utf-8')

  // Vérifier si l'ID de catégorie est un nombre valide
  const parsedCategoryId = parseInt(categoryId, 10)
  if (isNaN(parsedCategoryId)) {
    return { error: 'ID de catégorie invalide.' }
  }

  console.log(parsedCategoryId)
  try {
    // Convertir le buffer en stream
    const fileStream = new Readable()
    fileStream.push(file.data)
    fileStream.push(null)

    // Upload du fichier sur Cloudinary
    const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'images' }, // Dossier optionnel
        (error, result) => {
          if (error) {
            return reject(error)
          }
          resolve(result as CloudinaryUploadResult)
        }
      )
      fileStream.pipe(uploadStream)
    })

    // Insérer dans la base de données avec l'ID de catégorie fourni
    const [image] = await db.insert(images).values({
      path: result.secure_url,
      uploadedAt: new Date(),
      categoryId: parsedCategoryId
    }).returning()

    return { data: {
      message: 'success',
      image: image
    } }
  } catch {
    return { error: 'Failed to upload image to Cloudinary' }
  }
})
