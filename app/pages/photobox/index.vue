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
          icon="ic:baseline-plus"
          variant="solid"
          color="primary"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
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
  </div>
</template>

<script setup lang="ts">
const { data: categories } = await useFetch('/api/categories')
</script>
