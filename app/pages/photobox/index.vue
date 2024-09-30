<template>
  <div>
    <h1>Test</h1>
    <UCard @submit.prevent="addImage">
      <div class="flex items-center gap-2">
        <UInput
          ref="newImageInput"
          v-model="newImage"
          name="image"
          :disabled="loading"
          class="flex-1"
          placeholder="Make a Nuxt demo"
          autocomplete="off"
          autofocus
          :ui="{ wrapper: 'flex-1' }"
        />

        <UButton
          type="submit"
          icon="i-heroicons-plus-20-solid"
          :loading="loading"
          :disabled="newImage.trim().length === 0"
        />
      </div>
      <ul>
        <li
          v-for="image in images"
          :key="image.id"
        >
          {{ image.url }}
        </li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const loading = ref(false)
const newImage = ref('')
const newImageInput = ref(null)
const { data: images } = await useFetch('/api/images')
async function addImage() {
  if (!newImage.value.trim()) return

  loading.value = true

  try {
    const image = await $fetch('/api/images', {
      method: 'POST',
      body: {
        url: newImage.value,
        completed: 0
      }
    })
    images.value.push(image)
    await refresh()
    toast.add({ url: `Todo "${image.url}" created.` })
    newImage.value = ''
    nextTick(() => {
      newImageInput.value?.input?.focus()
    })
  } catch (err) {
    if (err.data?.data?.issues) {
      const url = err.data.data.issues.map(issue => issue.message).join('\n')
      toast.add({ url, color: 'red' })
    }
  }
  loading.value = false
}
</script>
