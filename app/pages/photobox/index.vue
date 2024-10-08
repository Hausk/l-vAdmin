<template>
  <div class="">
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
      </template>
    </Navbar>
    <div class="p-5 w-full columns-3-xsw-full md:columns-4 columns-2">
      <NuxtLink
        v-for="categorie in categories"
        :key="categorie.id"
        :to="`/photobox/${categorie.slug}`"
        class="w-full aspect-square mb-4 relative"
      >
        <img
          :src="categorie.pinnedImage?.path"
          alt="Pinned Image"
        >
        <p class="bottom-0 left-1/2 -translate-x-1/2 absolute bg-black px-5 py-1">
          {{ categorie.name }}
        </p>
      </NuxtLink>
    </div>
    <UModal
      v-model="isModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxCategoriesForm
        @close="isModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { data: categories, refresh } = await useFetch('/api/categories')
const isModalOpen = ref(false)
const handleImagesUploaded = async () => {
  await refresh()
}
const toggleSidebar = () => {
  // LOGIQUE
}
</script>
