<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const defaultColumns = [{
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'email',
  label: 'Email',
  sortable: true
}, {
  key: 'actions',
  label: 'Actions',
  sortable: false
}]

const q = ref('')
const selected = ref([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const toast = useToast()
const schema = z.object({
  email: z.string().email('Ce n\'est pas un email').min(5, 'Il manque des lettres'),
  name: z.string().min(5, 'le nom est trop court')
})

const isEmailUnique = ref(true)
const isCheckingEmail = ref(false)
const state = reactive({
  email: undefined,
  name: undefined
})

const validate = (state: any): any[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Requis' })
  if (!state.name) errors.push({ path: 'name', message: 'Requis' })
  if (!isEmailUnique.value) errors.push({ path: 'email', message: 'Cet email est déjà utilisé' })
  return errors
}

const validateEmail = async (email: string) => {
  if (!email || !schema.shape.email.safeParse(email).success) return
  isCheckingEmail.value = true
  try {
    const response = await $fetch('/api/users/check-unique', {
      method: 'POST',
      body: { email }
    })
    isEmailUnique.value = response.available
  } catch (error) {
    console.error('Error checking email uniqueness:', error)
    isEmailUnique.value = true
  } finally {
    isCheckingEmail.value = false
  }
}

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))

const { data: users, pending, refresh } = await useFetch('/api/users', { query, default: () => [] })

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
const toggleSidebar = () => {
  // LOGIQUE
}

const isNewUserModalOpen = ref(false)
const isEditUserModalOpen = ref(false)
const editingUser = ref(null)

const resetForm = () => {
  state.email = undefined
  state.name = undefined
}
const closeModal = () => {
  isNewUserModalOpen.value = false
  isEditUserModalOpen.value = false
  editingUser.value = null
  resetForm()
}
const addUser = async (event: FormSubmitEvent<any>) => {
  try {
    const res = await $fetch('/api/users', {
      method: 'POST',
      body: {
        email: event.data.email,
        name: event.data.name
      }
    })
    const user = res[0]
    await refresh()
    console.log(user)
    toast.add({ title: `Utilisateur "${user.name}" créé.`, color: 'green' })
    closeModal()
  } catch {
    toast.add({ title: 'Erreur lors de la création de l\'utilisateur.', color: 'red' })
  }
}
const editUser = async (event: FormSubmitEvent<any>) => {
  try {
    const res = await $fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PATCH',
      body: {
        email: event.data.email,
        name: event.data.name
      }
    })
    await refresh()
    toast.add({ title: `Utilisateur "${res.name}" modifié.`, color: 'green' })
    closeModal()
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la modification de l\'utilisateur.', color: 'red' })
  }
}

const deleteUsers = async () => {
  try {
    await $fetch('/api/users/', {
      method: 'DELETE',
      body: { ids: selected.value.map(user => user.id) }
    })
    await refresh()
    toast.add({ title: `${selected.value.length} utilisateur(s) supprimé(s).`, color: 'green' })
    selected.value = []
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la suppression des utilisateurs.', color: 'red' })
  }
}

const openEditModal = (user) => {
  editingUser.value = user
  state.email = user.email
  state.name = user.name
  isEditUserModalOpen.value = true
}
</script>

<template>
  <div class="w-full h-full">
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="[{ label: 'Utilisateurs' }]"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <div class="flex gap-4">
          <UButton
            label="Ajouter un utilisateur"
            trailing-icon="ic:baseline-plus"
            color="gray"
            class="hidden md:flex"
            @click="isNewUserModalOpen = true"
          />
          <UButton
            icon="ic:baseline-plus"
            color="gray"
            class="flex md:hidden"
            @click="isNewUserModalOpen = true"
          />
          <UButton
            v-if="selected.length > 0"
            label="Supprimer"
            color="red"
            icon="ic:baseline-delete"
            class="hidden md:flex"
            @click="deleteUsers"
          /><UButton
            v-if="selected.length > 0"
            label="Supprimer"
            color="red"
            icon="ic:baseline-delete"
            class="flex md:hidden"
            @click="deleteUsers"
          />
        </div>
      </template>
    </Navbar>
    <UModal v-model="isNewUserModalOpen">
      <UCard>
        <h3 class="font-semibold">
          Création d'utilisateur
        </h3>

        <UForm
          :schema="schema"
          :state="state"
          :validate="validate"
          class="space-y-4"
          @submit="addUser"
        >
          <UFormGroup
            label="Email"
            name="email"
            eager-validation
            required
          >
            <UInput
              v-model="state.email"
              placeholder="exemple@gmail.com"
              @update:model-value="validateEmail"
            />
          </UFormGroup>
          <UFormGroup
            label="Nom"
            name="name"
            eager-validation
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Jean Charles"
            />
          </UFormGroup>
          <div class="flex w-full justify-end gap-6">
            <UButton
              label="Annuler"
              color="white"
              @click="closeModal"
            />
            <UButton
              :disabled="!isEmailUnique || state.email != undefined ? true : false"
              label="Valider"
              color="primary"
              type="submit"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>
    <UModal v-model="isEditUserModalOpen">
      <UCard>
        <h3 class="font-semibold">
          Modification  d'utilisateur
        </h3>

        <UForm
          :schema="schema"
          :state="state"
          :validate="validate"
          class="space-y-4"
          @submit="editUser"
        >
          <UFormGroup
            label="Email"
            name="email"
            eager-validation
            required
          >
            <UInput
              v-model="state.email"
              placeholder="exemple@gmail.com"
              @update:model-value="validateEmail"
            />
          </UFormGroup>
          <UFormGroup
            label="Nom"
            name="name"
            eager-validation
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Jean Charles"
            />
          </UFormGroup>
          <div class="flex w-full justify-end gap-6">
            <UButton
              label="Annuler"
              color="white"
              @click="closeModal"
            />
            <UButton
              :disabled="!isEmailUnique || state.email != undefined ? true : false"
              label="Valider"
              color="primary"
              type="submit"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>
    <div class="p-4">
      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="users"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
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
        <template #actions-data="{ row }">
          <UButton
            icon="ic:baseline-edit"
            color="primary"
            variant="ghost"
            @click="openEditModal(row)"
          />
        </template>
      </UTable>
    </div>
  </div>
</template>
