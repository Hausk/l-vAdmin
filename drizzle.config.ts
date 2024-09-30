import { defineConfig } from 'drizzle-kit'

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  dbCredentials: {
    url: process.env.POSTGRES_URL
  }
})
