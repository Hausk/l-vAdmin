<script setup lang="ts">
import type { NuxtError } from '#app'

const errorMessage = ref('')
const errorUrl = useRoute().query.error as string
if (errorUrl === 'unauthorized') {
  const toast = useToast()
  errorMessage.value = 'Vous n\'êtes pas autorisé à accéder à cette page.'
  toast.add({
    id: '1',
    title: 'Erreur',
    description: errorMessage.value,
    color: 'red',
    timeout: 10000
  })
}

useSeoMeta({
  title: 'Connexion à Libre & Vivant',
  description: 'Page de connexion au dashboard d administration Libre & Vivant.'
})

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})
definePageMeta({
  layout: 'login'
})
</script>

<template>
  <div class="w-screen h-screen flex">
    <UContainer class="m-auto">
      <UCard class="relative">
        <div class="flex flex-col mb-8">
          <h1 class="text-2xl text-gray-900 dark:text-white font-bold">
            Se connecter
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Connectes-toi pour accéder au dashboard de Libre & Vivant
          </p>
        </div>
        <div class="gap-y-6 flex flex-col">
          <UButton
            to="/api/auth/google"
            icon="i-simple-icons-google"
            label="Se connecter avec Google"
            color="gray"
            external
            size="xl"
            block
            variant="solid"
          />
        </div>
      </UCard>
    </UContainer>
    <UNotifications />
  </div>
</template>
