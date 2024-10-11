<script setup>
import UploadNotification from '~/components/UploadNotification.vue'

const { loggedIn } = useUserSession()

if (!loggedIn.value) {
  navigateTo('/login')
}

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }]
})
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Dashboard - Libre & Vivant',
  description: 'Partie Administration du même site vitrine.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})

const isSidebarOpen = ref(true)
</script>

<template>
  <div class="w-screen h-screen flex">
    <SideBar :is-open="isSidebarOpen" />
    <div class="lg:ml-[18rem] min-h-screen overflow-x-hidden w-full">
      <div class="flex-1 relative w-full">
        <NuxtPage />
      </div>
    </div>
    <UNotifications />
    <UploadNotification />
  </div>
</template>
