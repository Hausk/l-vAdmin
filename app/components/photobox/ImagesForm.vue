<script setup lang="ts">
import { ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'

interface PreviewImage {
  id: string
  file: File
  preview: string
}

const props = defineProps<{
  categoryId: number
}>()

const previewImages = ref<PreviewImage[]>([])
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const emit = defineEmits(['close', 'imagesUploaded', 'upload-status'])

const handleFiles = (files: File[]) => {
  const newPreviewImages = files.map(file => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    file,
    preview: URL.createObjectURL(file)
  }))
  previewImages.value.push(...newPreviewImages)
}

const removeImage = (id: string) => {
  const index = previewImages.value.findIndex(img => img.id === id)
  if (index !== -1) {
    URL.revokeObjectURL(previewImages.value[index].preview)
    previewImages.value.splice(index, 1)
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

const uploadImages = async () => {
  isUploading.value = true
  uploadProgress.value = 0
  const totalImages = previewImages.value.length
  const uploadedImages = []

  for (let i = 0; i < totalImages; i++) {
    const { file } = previewImages.value[i]
    const formData = new FormData()
    formData.append('image', file)
    formData.append('categoryId', props.categoryId.toString())

    try {
      const response = await $fetch('/api/images', {
        method: 'POST',
        body: formData
      })

      if (response.data && response.data.image) {
        uploadedImages.push(response.data.image)
      }

      uploadProgress.value = ((i + 1) / totalImages) * 100
      emit('upload-status', uploadProgress.value)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  isUploading.value = false
  emit('imagesUploaded', uploadedImages)
  previewImages.value = []
  emit('close') // Déplacé ici, après la fin de l'upload
}

const onSubmit = async (event: FormSubmitEvent<any>) => {
  event.preventDefault()
  emit('close') // Ferme la modal immédiatement
  await uploadImages() // Continue l'upload en arrière-plan
}
const onCancel = () => {
  previewImages.value.forEach(img => URL.revokeObjectURL(img.preview))
  previewImages.value = []
  emit('close')
}
</script>

<template>
  <div class="p-5">
    <form
      class="space-y-4 mb-5"
      @submit="onSubmit"
    >
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
          {{ previewImages.length }} image(s) en prévisualisation
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
      <div class="w-full max-h-[50vh] overflow-y-auto overflow-x-hidden">
        <div class="w-full columns-3">
          <div
            v-for="image in previewImages"
            :key="image.id"
            class="mb-4 relative group"
          >
            <img
              :src="image.preview"
              :alt="image.file.name"
              class="w-full aspect-square rounded-lg object-cover"
            >
            <button
              type="button"
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
          label="Sauvegarder"
          color="black"
          :loading="isUploading"
        />
      </div>
    </form>
  </div>
</template>
