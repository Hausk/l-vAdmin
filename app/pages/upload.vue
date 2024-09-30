<template>
  <div>
    <h2>Upload Image</h2>
    <form @submit.prevent="uploadImage">
      <input
        type="file"
        @change="handleFileChange"
      >
      <button
        :disabled="loading"
        type="submit"
      >
        Upload
      </button>
      <p v-if="message">
        {{ message }}
      </p>
    </form>
    <div class="w-full md:columns-4 columns-2 my-10">
      <div
        v-for="image in images"
        :key="image.id"
        class="w-full mb-4"
      >
        <img
          :src="image.path"
          alt="Image"
          width="100"
          height="100"
          class="w-full"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'

definePageMeta({
  middleware: 'auth'
})
const { user, clear } = useUserSession()
const { data: images } = await useFetch('/api/images')
const loading = ref(false)
const message = ref('')
const imageFile = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
  }
}
images.value.slice().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

const uploadImage = async () => {
  if (!imageFile.value) {
    message.value = 'Please select an image file'
    return
  }

  loading.value = true
  message.value = 'Pending...'
  const categorie = 1

  const formData = new FormData()
  formData.append('image', imageFile.value)
  formData.append('userId', user.sub)
  formData.append('categoryId', categorie)

  try {
    const { data, error } = await useFetch('/api/images', {
      method: 'POST',
      body: formData
    })

    // Handle success or error
    if (error.value) {
      message.value = 'Failed to upload image: ' + error.value.message
    } else {
      images.value.unshift(data.value.data.image)
      message.value = 'Success: Image uploaded!'
    }
  } catch (err) {
    message.value = 'An unexpected error occurred: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<style>
.test {
  column-count: 3;
}
</style>
