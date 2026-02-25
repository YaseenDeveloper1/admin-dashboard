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

// Users sorted by ID 
const sortedUsers = computed(() => {
  return [...usersStore.users].sort((a, b) => Number(a.id) - Number(b.id))
})

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <MainLayout>
    <div class="space-y-6">
      <!-- Header with Add button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Users</h1>
          <p class="text-slate-500 text-sm mt-1">All Users List</p>
        </div>
        <button
          @click="openAddModal"
          class="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span class="text-lg">+</span> Add User
        </button>
      </div>

      <!-- Error message -->
      <div v-if="usersStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
        <span class="text-red-500 font-bold">!</span> {{ usersStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="usersStore.loading" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center gap-4">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="user in sortedUsers"
                :key="user.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-slate-800">{{ user.id }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ user.firstName }} {{ user.lastName }}</td>
                <td class="px-6 py-4 text-sm text-slate-600">{{ user.email }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex gap-2 justify-end">
                    <button
                      @click="openEditModal(user)"
                      class="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      @click="openDeleteModal(user)"
                      class="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Add User</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">First Name</label>
            <input
              v-model="formData.firstName"
              placeholder="John"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
            <input
              v-model="formData.lastName"
              placeholder="Doe"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="john@example.com"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            @click="handleAddUser"
            class="px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-medium transition shadow-md"
          >
            Add User
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Edit User</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">First Name</label>
            <input
              v-model="formData.firstName"
              placeholder="John"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
            <input
              v-model="formData.lastName"
              placeholder="Doe"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="john@example.com"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            @click="handleEditUser"
            class="px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium transition shadow-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span class="text-red-500 text-xl font-bold">!</span>
        </div>
        <h2 class="text-xl font-bold text-slate-800 mb-2 text-center">Delete User</h2>
        <p class="text-slate-600 text-center mb-6">
          Are you sure you want to delete <strong class="text-slate-800">{{ selectedUserName }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="closeModals"
            class="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteUser"
            class="px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
