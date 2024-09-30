// server/validators/uploadValidator.ts
import { z } from 'zod'

export const uploadSchema = z.object({
  files: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      size: z.number().max(5 * 1024 * 1024, 'File size should not exceed 5MB'),
      content: z.any() // Use 'z.any()' for the file buffer content
    })
  )
})
