<template>
  <div class="w-full">
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="[{ label: 'Photobox' }]"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <UButton
          label="Ajout d'une catégorie"
          trailing-icon="ic:baseline-plus"
          color="primary"
          class="hidden md:flex"
          @click="isModalOpen = true"
        />
        <UButton
          icon="ic:baseline-plus"
          color="primary"
          class="flex md:hidden"
          @click="isModalOpen = true"
        />
      </template>
    </Navbar>

    <div
      ref="container"
      class="grid gap-4 p-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(category, index) in categories"
        :key="index"
        :data-swapy-slot="index"
        class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden aspect-square max-h-[45vh]"
      >
        <div
          class="relative h-full w-full"
          :data-swapy-item="index"
        >
          <NuxtLink
            :to="`/photobox/${category.slug}`"
            class="absolute inset-0 z-10"
          />
          <div class="w-full h-full relative overflow-hidden flex justify-center">
            <img
              v-if="category.pinnedImage?.path"
              :src="category.pinnedImage.path"
              :alt="category.name"
              class="relative object-cover m-auto"
            >
            <div
              v-else
              class=" w-full h-full bg-gray-800 flex items-center justify-center text-white text-sm"
            >
              <p>Aucune image épinglée</p>
            </div>
            <div class="absolute top-2 right-2 flex space-x-2 opacity-1 z-50">
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="solid"
                size="xs"
                @click="openDeleteModal(category)"
              />
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-black to-transparent p-2">
            <p class="text-sm font-semibold">
              {{ category.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model="isModalOpen"
      title="Nouvelle catégorie"
      description="Ajoutez une nouvelle catégorie à votre Photobox"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxCategoriesForm
        @close="isModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
    <UModal
      v-model="isDeleteModalOpen"
    >
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">
          Confirmer la suppression
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 text-pretty">
          Êtes-vous sûr de vouloir supprimer la catégorie <span class="text-primary font-bold">{{ selectedCategory.name }}</span> ?<br>
          Cette action supprimera également toutes les images associées à cette catégorie.
        </p>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="soft"
            @click="isDeleteModalOpen = false"
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
      </div>
    </UModal>
    <UploadNotification />
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from '~/stores/uploadStore'

const { data: categories, refresh } = await useFetch('/api/categories')
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const selectedCategory = ref(null)
const uploadStore = useUploadStore()
const handleImagesUploaded = async () => {
  await refresh()
}
const openDeleteModal = (category: any) => {
  selectedCategory.value = category
  isDeleteModalOpen.value = true
}

const deleteCategory = async () => {
  if (!selectedCategory.value) return

  try {
    isDeleting.value = true
    await $fetch(`/api/categories/${selectedCategory.value.id}`, {
      method: 'DELETE'
    })
    isDeleting.value = false
    isDeleteModalOpen.value = false
    useToast().add({
      title: 'Succès',
      description: `La catégorie ${selectedCategory.value.name} a été supprimée avec succès`,
      color: 'green'
    })
    await refresh()
  } catch {
    isDeleteModalOpen.value = false
    isDeleting.value = false
    useToast().add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la suppression',
      color: 'red'
    })
  }
}
const toggleSidebar = () => {
  // Logique pour basculer la barre latérale
}
watch(() => uploadStore.isUploading, (newValue) => {
  if (!newValue) {
    refresh()
  }
})
</script>
