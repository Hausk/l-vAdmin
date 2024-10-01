<template>
  <div class="w-full h-screen">
    <div class="h-14 lg:border-b border-gray-200 dark:border-gray-800 flex px-5 justify-between">
      <UBreadcrumb
        divider="/"
        :links="links"
        class="my-auto"
      />

      <div class="button my-auto">
        <UButton
          label="Ajout d'images"
          trailing-icon="ic:baseline-plus"
          color="gray"
          @click="isNewUserModalOpen = true"
        />
      </div>
    </div>
    <div
      class="
        w-full
        columns-3-xsw-full
        md:columns-4
        columns-2
        p-5"
    >
      <div
        v-for="image in images"
        :key="image.id"
        class="w-full aspect-square mb-4"
      >
        <img
          :src="image.path"
          alt="img path"
          class="w-full aspect-square"
        >
      </div>
    </div>
    <UModal
      v-model="isNewUserModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <!-- ~/components/users/UsersForm.vue -->
      <PhotoboxImagesForm @close="isNewUserModalOpen = false" />
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data } = await useFetch(`/api/categories/${route.params.slug}`)
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}

const images = data.value.images
const categoryName = data.value.name
const links = [{
  label: 'Photobox',
  to: '/photobox'
}, {
  label: categoryName.toUpperCase()
}]
const isNewUserModalOpen = ref(false)
</script>
