<script setup lang="ts">
const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'email',
  label: 'Email',
  sortable: true
}]

const q = ref('')
const selected = ref([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))

const { data: users, pending } = await useFetch('/api/users', { query, default: () => [] })

function onSelect(row: never) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})
</script>

<template>
  <UTable
    v-model="selected"
    v-model:sort="sort"
    :rows="users"
    :columns="columns"
    :loading="pending"
    sort-mode="manual"
    class="w-full"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
    @select="onSelect"
  >
    <template #name-data="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar
          v-bind="row.avatar"
          :alt="row.name"
          size="xs"
        />

        <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
      </div>
    </template>

    <template #status-data="{ row }">
      <UBadge
        :label="row.status"
        :color="row.status === 'subscribed' ? 'green' : row.status === 'bounced' ? 'orange' : 'red'"
        variant="subtle"
        class="capitalize"
      />
    </template>
  </UTable>
</template>
