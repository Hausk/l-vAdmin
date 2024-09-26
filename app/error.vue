<script setup lang="ts">
import type { NuxtError } from '#app'

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <div class="w-screen h-screen flex">
    <UContainer class="m-auto">
      <div class="min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center">
        <p class="text-base font-semibold text-primary">
          {{ error.statusCode }}
        </p>
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page non trouvée : {{ error.url }}
        </h2>
        <p class="mt-6 text-base/7 text-gray-500 dark:text-gray-400 text-center">
          Cette page n'est pas celle que tu recherches
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <UButton
            size="xl"
            label="Revenir au dashboard"
            class="m-auto"
            to="/"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
