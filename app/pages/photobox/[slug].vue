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
            label="Ajout d'images"
            trailing-icon="ic:baseline-plus"
            color="gray"
            class="hidden md:flex"
            @click="isModalOpen = true"
          />
          <UButton
            icon="ic:baseline-plus"
            color="gray"
            class="flex md:hidden"
            @click="isModalOpen = true"
          />
          <UButton
            v-if="selectedImages.length > 0"
            label="Supprimer sélection"
            icon="i-heroicons-trash"
            color="red"
            class="hidden md:flex"
            @click="deleteSelectedImages"
          />
          <UButton
            v-if="selectedImages.length > 0"
            icon="i-heroicons-trash"
            color="red"
            class="flex md:hidden"
            @click="deleteSelectedImages"
          />
        </div>
      </template>
    </Navbar>

    <div
      class="
        w-full
        columns-3-xsw-full
        md:columns-3
        lg:columns-4
        columns-2
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
        class="w-full aspect-square mb-4 relative group max-h-[50vh] overflow-hidden flex"
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
    <UModal v-model="isDeleteCategoryModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Confirmer la suppression
            </h3>
          </div>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer cette catégorie et toutes ses images associées ? Cette action est irréversible.</p>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="gray"
              @click="isDeleteCategoryModalOpen = false"
            >
              Annuler
            </UButton>
            <UButton
              color="red"
              @click="deleteCategory"
            >
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useUploadStore } from '~/stores/uploadStore'

const router = useRouter()
const route = useRoute()
const { data, refresh } = await useFetch(`/api/categories/${route.params.slug}`)

const isModalOpen = ref(false)
const uploadStore = useUploadStore()

const isUploading = ref(false)
const uploadProgress = ref(0)
const pinnedImageId = ref(data.value.pinnedImageId)
const isDeleteCategoryModalOpen = ref(false)
const selectedImages = ref<number[]>([])
const images = ref(data.value.images)
const categoryName = ref(data.value.name)
const categoryId = ref(data.value.id)

const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar') as HTMLElement
  sidebar.classList.toggle('hidden')
}

if (!data.value) {
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
    if (a.id === data.value.pinnedImageId) return -1
    if (b.id === data.value.pinnedImageId) return 1
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
      await refresh()
    }
  } catch (error) {
    console.error('Error pinning image:', error)
    // Handle error (e.g., show error message to user)
  }
}

const deleteSelectedImages = async () => {
  try {
    await $fetch(`/api/images/bulk-delete`, {
      method: 'POST',
      body: { imageIds: selectedImages.value }
    })
    images.value = images.value.filter((img: any) => !selectedImages.value.includes(img.id))
    selectedImages.value = []
  } catch (error) {
    console.error('Error deleting images:', error)
    // Handle error (e.g., show error message to user)
  }
}

const deleteCategory = async () => {
  try {
    await $fetch(`/api/categories/${categoryId.value}`, {
      method: 'DELETE'
    })
    router.push('/photobox')
  } catch (error) {
    console.error('Error deleting category:', error)
    // Handle error (e.g., show error message to user)
  }
  isDeleteCategoryModalOpen.value = false
}

const handleImagesUploaded = async () => {
  await refresh()
}
watch(() => uploadStore.isUploading, (newValue) => {
  if (!newValue) {
    refresh()
  }
})
</script>
