<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUsersStore } from '../stores/users'
import MainLayout from '../layouts/MainLayout.vue'

const usersStore = useUsersStore()

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: ''
})

// Reset form
const resetForm = () => {
  formData.value = { firstName: '', lastName: '', email: '' }
  selectedUser.value = null
}

// Open Add modal
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

// Open Edit modal with user data
const openEditModal = (user) => {
  selectedUser.value = user
  formData.value = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }
  showEditModal.value = true
}

// Open Delete confirmation
const openDeleteModal = (user) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

// Close all modals
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  resetForm()
}

// Add user
const handleAddUser = async () => {
  const result = await usersStore.addUser(formData.value)
  if (result.success) {
    closeModals()
  }
}

// Edit user
const handleEditUser = async () => {
  if (!selectedUser.value) return
  const result = await usersStore.updateUser(selectedUser.value.id, formData.value)
  if (result.success) {
    closeModals()
  }
}

// Delete user
const handleDeleteUser = async () => {
  if (!selectedUser.value) return
  const result = await usersStore.deleteUser(selectedUser.value.id)
  if (result.success) {
    closeModals()
  }
}

// User full name for delete confirmation
const selectedUserName = computed(() => {
  if (!selectedUser.value) return ''
  return `${selectedUser.value.firstName} ${selectedUser.value.lastName}`
})

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <MainLayout>
    <div class="space-y-4">
      <!-- Header with Add button -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Users</h1>
        <button
          @click="openAddModal"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add User
        </button>
      </div>

      <!-- Error message -->
      <div v-if="usersStore.error" class="bg-red-100 text-red-700 p-3 rounded">
        {{ usersStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="usersStore.loading" class="text-center text-lg py-12">
        Loading users...
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white shadow rounded overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in usersStore.users"
              :key="user.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">{{ user.id }}</td>
              <td class="p-3">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3 text-right space-x-2">
                <button
                  @click="openEditModal(user)"
                  class="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(user)"
                  class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModals"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Add User</h2>
        <input
          v-model="formData.firstName"
          placeholder="First Name"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="formData.lastName"
          placeholder="Last Name"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          class="w-full mb-4 p-2 border rounded"
        />
        <div class="flex gap-2 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleAddUser"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModals"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Edit User</h2>
        <input
          v-model="formData.firstName"
          placeholder="First Name"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="formData.lastName"
          placeholder="Last Name"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          class="w-full mb-4 p-2 border rounded"
        />
        <div class="flex gap-2 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleEditUser"
            class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModals"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Delete User</h2>
        <p class="mb-4">
          Are you sure you want to delete <strong>{{ selectedUserName }}</strong>?
        </p>
        <div class="flex gap-2 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteUser"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
