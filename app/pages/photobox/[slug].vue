<template>
  <div class="w-full h-screen">
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="links"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <div class="flex gap-4">
          <UButton
            label="Éditer catégorie"
            icon="i-heroicons-pencil-square"
            color="orange"
            class="hidden lg:flex"
            @click="isEditCategoryModalOpen = true"
          />
          <UButton
            icon="i-heroicons-pencil-square"
            color="orange"
            class="flex lg:hidden"
            @click="isEditCategoryModalOpen = true"
          />
          <UButton
            label="Ajout d'images"
            trailing-icon="ic:baseline-plus"
            color="gray"
            class="hidden lg:flex"
            @click="isModalOpen = true"
          />
          <UButton
            icon="ic:baseline-plus"
            color="gray"
            class="flex lg:hidden"
            @click="isModalOpen = true"
          />
          <UButton
            v-if="selectedImages.length > 0"
            label="Supprimer sélection"
            icon="i-heroicons-trash"
            color="red"
            class="hidden lg:flex"
            @click="deleteSelectedImages"
          />
          <UButton
            v-if="selectedImages.length > 0"
            icon="i-heroicons-trash"
            color="red"
            class="flex lg:hidden"
            @click="deleteSelectedImages"
          />
        </div>
      </template>
    </Navbar>

    <div
      class="
        w-full
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
        p-5"
    >
      <div
        v-if="isUploading"
        class="w-full mb-4"
      >
        <p>Upload en cours : {{ uploadProgress.toFixed(2) }}%</p>
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
      <div
        v-for="image in sortedImages"
        :key="image.id"
        class="w-full aspect-square mb-4 relative group max-h-[50vh] overflow-hidden flex border-gray-200 dark:border-gray-600 rounded-lg border"
      >
        <img
          :src="image.path"
          alt="img path"
          class="w-full m-auto object-cover"
          :class="{ 'opacity-50': selectedImages.includes(image.id) }"
          loading="lazy"
        >
        <div class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <UCheckbox
            v-model="selectedImages"
            :value="image.id"
            color="primary"
          />
          <UButton
            :icon="pinnedImageId == image.id ? 'material-symbols:star' : 'material-symbols:star-outline' "
            color="white"
            :style="pinnedImageId == image.id ? 'color:yellow' : 'color:white'"
            variant="solid"
            size="xs"
            @click="togglePinImage(image.id)"
          />
        </div>
      </div>
    </div>
    <UModal
      v-model="isEditCategoryModalOpen"
    >
      <UCard>
        <h3 class="font-semibold">
          Modification de {{ categoryName }}
        </h3>

        <UForm
          :validate="validate"
          :validate-on="['submit']"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup
            label="Nom de la catégorie"
            name="categoryName"
            eager-validation
            required
          >
            <UInput
              v-model="state.categoryName"
              :placeholder="categoryName"
              @update:model-value="validateCategoryName"
            />
          </UFormGroup>
          <div class="flex w-full justify-end gap-6">
            <UButton
              label="Annuler"
              color="white"
              @click="closeModal"
            />
            <UButton
              :disabled="!isCategoryNameUnique || !state.categoryName"
              label="Valider"
              color="primary"
              type="submit"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>
    <UModal
      v-model="isModalOpen"
      title="Ajout d'images"
      description="Ajout de nouvelles images à votre Photobox"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxImagesForm
        :category-id="categoryId"
        @close="isModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useUploadStore } from '~/stores/uploadStore'
import type { FormError } from '#ui/types'

const router = useRouter()
const route = useRoute()
const { data: imagesList, refresh } = await useFetch(`/api/categories/${route.params.slug}`)

const isModalOpen = ref(false)
const isEditCategoryModalOpen = ref(false)
const uploadStore = useUploadStore()

const isCategoryNameAvailable = ref(true)
const isUploading = ref(false)
const uploadProgress = ref(0)
const pinnedImageId = ref(imagesList.value.pinnedImageId)
const selectedImages = ref<number[]>([])
const images = ref(imagesList.value.images)
const categoryName = ref(imagesList.value.name)
const categoryId = ref(imagesList.value.id)
const emit = defineEmits(['close'])

const state = reactive({
  categoryName: categoryName.value
})

const isCategoryNameUnique = ref(true)
const validateCategoryName = async () => {
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

  await validateCategoryName()
  if (!isCategoryNameAvailable.value) {
    errors.push({ path: 'categoryName', message: 'Ce nom est déjà utilisé.' })
  }

  if (images.value.length === 0) errors.push({ path: 'images', message: 'Please upload at least one image.' })
  return errors
}
const updateCategory = async () => {
  try {
    const response: any = await $fetch(`/api/categories/${categoryId.value}`, {
      method: 'PATCH',
      body: { name: state.categoryName }
    })
    if (response) {
      categoryName.value = state.categoryName
      isEditCategoryModalOpen.value = false
      router.push(`/photobox/${response.slug}`)
    }
  } catch (error) {
    console.error('Error updating category:', error)
  }
}
const closeModal = () => {
  isEditCategoryModalOpen.value = false
  state.categoryName = categoryName.value
}
const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar') as HTMLElement
  sidebar.classList.toggle('hidden')
}

if (!imagesList.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}

const links = computed(() => [{
  label: 'Photobox',
  to: '/photobox'
}, {
  label: categoryName.value.toUpperCase()
}])

const sortedImages = computed(() => {
  return [...images.value].sort((a, b) => {
    if (a.id === imagesList.value.pinnedImageId) return -1
    if (b.id === imagesList.value.pinnedImageId) return 1
    return 0
  })
})

const togglePinImage = async (imageId: number) => {
  try {
    const response = await $fetch(`/api/categories/pin-image/${categoryId.value}`, {
      method: 'POST',
      body: { imageId }
    })
    if (response.success) {
      pinnedImageId.value = imageId
      await refresh()
    }
  } catch (error) {
    console.error('Error pinning image:', error)
  }
}

const deleteSelectedImages = async () => {
  await $fetch(`/api/images/bulk-delete`, {
    method: 'POST',
    body: { imageIds: selectedImages.value }
  })
  images.value = images.value.filter((img: any) => !selectedImages.value.includes(img.id))
  selectedImages.value = []
  await refresh()
}

const handleImagesUploaded = async () => {
  await refresh()
}
const onSubmit = async () => {
  if (isCategoryNameAvailable.value) {
    await updateCategory()
    emit('close')
  }
}
watch(() => uploadStore.isUploading, (newValue) => {
  if (!newValue) {
    refresh()
  }
})
</script>
