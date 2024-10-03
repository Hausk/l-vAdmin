<template>
  <div class="">
    <div class="h-14 lg:border-b border-gray-200 dark:border-gray-800 flex px-5 justify-between">
      <UBreadcrumb
        divider="/"
        :links="[{ label: 'Photobox' }]"
        class="my-auto"
      />

      <div class="button my-auto">
        <UButton
          label="Ajout d'une catégorie"
          trailing-icon="ic:baseline-plus"
          color="gray"
          @click="isNewUserModalOpen = true"
        />
      </div>
    </div>
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
      v-model="isNewUserModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxCategoriesForm
        @close="isNewUserModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { data: categories, refresh } = await useFetch('/api/categories')
const isNewUserModalOpen = ref(false)
const handleImagesUploaded = async () => {
  await refresh()
}
</script>
