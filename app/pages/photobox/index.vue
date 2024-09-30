<template>
  <div>
    <h1>Test</h1>
    <UCard>
      <ul>
        <li
          v-for="categorie in categories"
          :key="categorie.id"
        >
          <img
            :src="categorie.pinnedImage.path"
            alt="Pinned Image"
          >
          <p>{{ categorie.name }}</p>
        </li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data: categories } = await useFetch('/api/categories')
console.log(categories.value)
</script>
