<script setup lang="ts">
import LineChart from '~/components/LineChart.vue'

const stats = ref({
  totalUsers: 0,
  totalCategories: 0,
  totalImages: 0,
  cloudinarySpaceUsed: 0,
  cloudinaryTotalSpace: 0,
  cloudinaryPercentUsed: 0,
  imageUploadsOverTime: [],
  topCategories: [] as any
})

const { data } = await useFetch('/api/stats/storage') as any
const { data: topCategories } = await useFetch('/api/stats/top-categories', { lazy: true }) as any

onMounted(async () => {
  // Ici, vous feriez un appel API pour récupérer les vraies données
  // Pour l'exemple, nous utilisons des données fictives
  stats.value = {
    totalUsers: data.value.totalUsers,
    totalCategories: data.value.totalCategories,
    totalImages: data.value.totalImages,
    cloudinarySpaceUsed: data.value.storage.usage,
    cloudinaryTotalSpace: data.value.storage.limit,
    cloudinaryPercentUsed: data.value.storage.used_percent,
    imageUploadsOverTime: data.value.timeline,
    topCategories: topCategories.value
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <Navbar>
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="[{ label: 'Statistiques' }]"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <UButton
          icon="ic:baseline-plus"
          variant="solid"
          color="primary"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
        />
      </template>
    </Navbar>
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard>
          <UCardHeader class="flex items-center justify-between pb-2">
            <h3 class="text-lg font-medium">
              Total Utilisateurs
            </h3>
            <UIcon
              name="i-lucide-users"
              class="h-6 w-6 text-gray-500"
            />
          </UCardHeader>
          <UCardBody>
            <p class="text-4xl font-bold">
              {{ stats.totalUsers }}
            </p>
          </UCardBody>
        </UCard>

        <UCard>
          <UCardHeader class="flex items-center justify-between pb-2">
            <h3 class="text-lg font-medium">
              Total Catégories
            </h3>
            <UIcon
              name="i-lucide-folder-open"
              class="h-6 w-6 text-gray-500"
            />
          </UCardHeader>
          <UCardBody>
            <p class="text-4xl font-bold">
              {{ stats.totalCategories }}
            </p>
          </UCardBody>
        </UCard>

        <UCard>
          <UCardHeader class="flex items-center justify-between pb-2">
            <h3 class="text-lg font-medium">
              Total Images
            </h3>
            <UIcon
              name="i-lucide-image"
              class="h-6 w-6 text-gray-500"
            />
          </UCardHeader>
          <UCardBody>
            <p class="text-4xl font-bold">
              {{ stats.totalImages }}
            </p>
          </UCardBody>
        </UCard>

        <UCard>
          <UCardHeader class="flex items-center justify-between pb-2">
            <h3 class="text-lg font-medium">
              Stockage Cloud restant
            </h3>
            <UIcon
              name="i-lucide-hard-drive"
              class="h-6 w-6 text-gray-500"
            />
          </UCardHeader>
          <UCardBody>
            <p class="text-4xl font-bold">
              {{ stats.cloudinarySpaceUsed }} / {{ stats.cloudinaryTotalSpace }}
            </p>
            <p class="text-xs text-gray-500">
              {{ stats.cloudinaryPercentUsed.toFixed(2) }}% utilisé
            </p>
          </UCardBody>
        </UCard>

        <UCard class="col-span-full lg:col-span-2">
          <UCardHeader>
            <h3 class="text-lg font-semibold">
              Uploads d'images au fil du temps
            </h3>
          </UCardHeader>
          <UCardBody>
            <LineChart
              :data="stats.imageUploadsOverTime"
            />
          </UCardBody>
        </UCard>
        <UCard class="col-span-full lg:col-span-2">
          <div class="flex flex-col space-y-1.5">
            <h3 class="text-lg font-medium">
              Total Utilisateurs
            </h3>
            <p class="text-xs text-gray-400">
              Top 5 des catégories avec le plus d'images
            </p>
            <UDivider class="pt-4" />
          </div>
          <div class="space-y-6">
            <div
              v-for="category in stats.topCategories.topCategories"
              :key="category.id"
              class="flex items-center"
            >
              <UAvatar
                :src="category.pinnedImageUrl"
                :alt="category.name"
                class="ml-2"
              />
              <p class="my-auto ml-4 text-xl font-bold truncate ...">
                {{ category.name }}
              </p>
              <p class="ml-auto text-xl font-bold">
                {{ category.imageCount }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
