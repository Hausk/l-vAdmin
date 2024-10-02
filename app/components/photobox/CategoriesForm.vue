<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormError, FormSubmitEvent } from '#ui/types'

interface Image {
  id: string
  name: string
  url: string
  visible: boolean
  file: File
}

const images = ref<Image[]>([])
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const isCategoryNameAvailable = ref(true)
const emit = defineEmits(['close'])

const state = reactive({
  categoryName: ''
})

const handleFiles = (files: File[]) => {
  const newImages = files.filter(file => !images.value.some(img => img.name === file.name))
    .map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      visible: false,
      file: file
    }))

  if (newImages.length > 0) {
    images.value.push(...newImages)
    animateImages()
  } else {
    alert('Toutes les images sélectionnées existent déjà dans la prévisualisation.')
  }
}

const animateImages = () => {
  images.value.forEach((image, index) => {
    setTimeout(() => {
      image.visible = true
    }, (images.value.length - index) * 50)
  })
}

const removeImage = (id: string) => {
  const index = images.value.findIndex(img => img.id === id)
  if (index !== -1) {
    images.value.splice(index, 1)
  }
}

const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    handleFiles(Array.from(input.files))
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files) {
    handleFiles(Array.from(event.dataTransfer.files))
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const openFileSelector = () => {
  fileInputRef.value?.click()
}

const checkCategoryNameAvailability = async () => {
  try {
    const response = await fetch(`/api/categories/check-name?name=${encodeURIComponent(state.categoryName)}`)
    const data = await response.json()
    isCategoryNameAvailable.value = data.available
  } catch (error) {
    console.error('Error checking category name availability:', error)
    isCategoryNameAvailable.value = false
  }
}

const validate = async (state: any): Promise<FormError[]> => {
  const errors = []
  if (!state.categoryName) errors.push({ path: 'categoryName', message: 'Please enter a category name.' })

  await checkCategoryNameAvailability()
  if (!isCategoryNameAvailable.value) {
    errors.push({ path: 'categoryName', message: 'This category name is already taken.' })
  }

  if (images.value.length === 0) errors.push({ path: 'images', message: 'Please upload at least one image.' })
  return errors
}

const uploadImagesAndCreateCategory = async () => {
  isUploading.value = true
  uploadProgress.value = 0

  try {
    // Create category
    const categoryResponse = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: state.categoryName })
    })
    const categoryData = await categoryResponse.json()
    const categoryId = categoryData.id

    // Upload images
    for (let i = 0; i < images.value.length; i++) {
      const image = images.value[i]
      const formData = new FormData()
      formData.append('file', image.file)
      formData.append('categoryId', categoryId.toString())

      await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })

      // Update progress
      uploadProgress.value = ((i + 1) / images.value.length) * 100
    }

    isUploading.value = false
    uploadProgress.value = 100
  } catch (error) {
    console.error('Error uploading images and creating category:', error)
    isUploading.value = false
  }
}

const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (isCategoryNameAvailable.value) {
    await uploadImagesAndCreateCategory()
    emit('close')
  }
}

const onCancel = () => {
  emit('close')
}
</script>

<template>
  <div class="p-5">
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="state"
      class="space-y-4 mb-5"
      @submit="onSubmit"
    >
      <UInput
        v-model="state.categoryName"
        label="Nom de la catégorie"
        placeholder="Entrez le nom de la catégorie"
        @blur="checkCategoryNameAvailability"
      />
      <p
        v-if="!isCategoryNameAvailable"
        class="text-red-500 text-sm"
      >
        Ce nom de catégorie est déjà utilisé.
      </p>

      <div
        class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4 cursor-pointer"
        :class="{ 'bg-gray-100': isDragging }"
        @drop="onDrop"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @click="openFileSelector"
      >
        <p
          v-if="isDragging"
          class="text-xl text-gray-600"
        >
          Lâche ici tes photos
        </p>
        <p
          v-else
          class="text-xl text-gray-500"
        >
          J'attends tes photos ici
        </p>
        <p class="mt-2 text-sm text-gray-400">
          {{ images.length }} image(s) en prévisualisation
        </p>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        multiple
        class="hidden"
        @change="onFileInputChange"
      >
      <div class="w-full max-h-[50vh] overflow-y-scroll overflow-x-hidden">
        <div class="w-full columns-3">
          <div
            v-for="image in images"
            :key="image.id"
            class="mb-4 transition-opacity duration-300 ease-in-out relative group"
            :class="{ 'opacity-0': !image.visible, 'opacity-100': image.visible }"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="w-full aspect-square rounded-lg"
            >
            <button
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              @click="removeImage(image.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <UButton
          label="Annuler"
          color="gray"
          variant="ghost"
          @click="onCancel"
        />
        <UButton
          type="submit"
          label="Créer catégorie et uploader les images"
          color="black"
          :disabled="!isCategoryNameAvailable"
        />
      </div>
    </UForm>

    <!-- Progress bar -->
    <div
      v-if="isUploading"
      class="fixed bottom-4 right-4 w-64 bg-white shadow-lg rounded-lg p-4"
    >
      <p class="text-sm font-semibold mb-2">
        Uploading images...
      </p>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-600 h-2.5 rounded-full"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
      <p class="text-xs mt-1 text-right">
        {{ Math.round(uploadProgress) }}% ({{ Math.ceil((images.length * uploadProgress) / 100) }} sur {{ images.length }} images uploadées)
      </p>
    </div>
  </div>
</template>

<style scoped>
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
</style>
