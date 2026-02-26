<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useUsersStore } from '../stores/users'
import MainLayout from '../layouts/MainLayout.vue'

const usersStore = useUsersStore()

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)
const openActionMenu = ref(null)

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Search & filter (uses shared searchQuery from store)
const filterAll = ref('All')

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const resetForm = () => {
  formData.value = { firstName: '', lastName: '', email: '' }
  selectedUser.value = null
}

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const openEditModal = (user) => {
  openActionMenu.value = null
  selectedUser.value = user
  formData.value = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }
  showEditModal.value = true
}

const openDeleteModal = (user) => {
  openActionMenu.value = null
  selectedUser.value = user
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  resetForm()
}

const toggleActionMenu = (id) => {
  openActionMenu.value = openActionMenu.value === id ? null : id
}

const handleAddUser = async () => {
  const result = await usersStore.addUser(formData.value)
  if (result.success) closeModals()
}

const handleEditUser = async () => {
  if (!selectedUser.value) return
  const result = await usersStore.updateUser(selectedUser.value.id, formData.value)
  if (result.success) closeModals()
}

const handleDeleteUser = async () => {
  if (!selectedUser.value) return
  const result = await usersStore.deleteUser(selectedUser.value.id)
  if (result.success) closeModals()
}

const selectedUserName = computed(() => {
  if (!selectedUser.value) return ''
  return `${selectedUser.value.firstName} ${selectedUser.value.lastName}`
})

// Sorted users
const sortedUsers = computed(() => {
  return [...usersStore.users].sort((a, b) => Number(a.id) - Number(b.id))
})

// Search filter
const filteredUsers = computed(() => {
  if (!usersStore.searchQuery.trim()) return sortedUsers.value
  const q = usersStore.searchQuery.toLowerCase()
  return sortedUsers.value.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q)
  )
})

// Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredUsers.value.slice(start, start + perPage.value)
})

// Pagination info
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage.value) || 1)
const showingFrom = computed(() => filteredUsers.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1)
const showingTo = computed(() => Math.min(currentPage.value * perPage.value, filteredUsers.value.length))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// Format helpers
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const formatPhone = (phone) => {
  if (!phone) return '-'
  const nums = phone.replace(/\D/g, '').slice(-10)
  if (nums.length >= 10) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`
  return phone
}

const getAmount = (user) => {
  const base = (Number(user.id) * 11.7) % 100
  return `$${base.toFixed(2)}`
}

const getStatus = (user) => {
  const statuses = ['Active', 'Danger', 'Pending']
  const idx = Number(user.id) % 3
  return statuses[idx]
}

const getStatusClass = (status) => {
  if (status === 'Danger') return 'bg-red-100 text-red-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}

// Reset page when search or perPage changes
watch([() => usersStore.searchQuery, perPage], () => {
  currentPage.value = 1
})

// Page numbers to show
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
      <div class="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between">
        <div class="flex items-center gap-3">
          <select v-model="filterAll" class="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500">
            <option value="All">All ({{ filteredUsers.length }})</option>
          </select>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-700 hover:bg-blue-700 text-white font-medium rounded-full text-sm flex items-center gap-1"
          >
             ADD NEW <span>+</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Search">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Settings">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Filter">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="usersStore.error" class="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ usersStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="usersStore.loading" class="p-12 flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-slate-500 text-sm">Loading users...</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left">
                <input type="checkbox" class="rounded border-slate-300" />
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Title
                <svg class="w-4 h-4 inline ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, idx) in paginatedUsers"
              :key="user.id"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
              class="border-b border-slate-100 hover:bg-slate-50"
            >
              <td class="px-6 py-4">
                <input type="checkbox" class="rounded border-slate-300" />
              </td>
              <td class="px-6 py-4">
                <img
                  :src="user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`"
                  :alt="user.firstName"
                  class="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td class="px-6 py-4 text-sm font-medium text-slate-800">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ formatDate(user.birthDate) }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ formatPhone(user.phone) }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ getAmount(user) }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusClass(getStatus(user))]">
                  {{ getStatus(user) }}
                </span>
              </td>
              <td class="px-6 py-4 relative">
                <button @click="toggleActionMenu(user.id)" class="p-1 rounded hover:bg-slate-200">
                  <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </button>
                <div
                  v-if="openActionMenu === user.id"
                  class="absolute right-6 top-12 z-50 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
                >
                  <button @click="openEditModal(user)" class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                  <button @click="openDeleteModal(user)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-slate-600">
          Showing {{ showingFrom }} to {{ showingTo }} of {{ filteredUsers.length }} entries
        </p>
        <div class="flex items-center gap-2">
          <select v-model.number="perPage" class="px-3 py-1.5 border border-slate-200 rounded text-sm">
            <option :value="10">Display 10</option>
            <option :value="20">Display 20</option>
            <option :value="30">Display 30</option>
          </select>
          <div class="flex items-center gap-1">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              v-for="p in pageNumbers"
              :key="p"
              @click="goToPage(p)"
              :class="[
                'px-3 py-1.5 rounded text-sm',
                currentPage === p ? 'bg-red-600 text-white border border-red-600' : 'border border-slate-200 hover:bg-slate-50'
              ]"
            >
              {{ p }}
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay to close action menu on outside click -->
    <div
      v-if="openActionMenu"
      @click="openActionMenu = null"
      class="fixed inset-0 z-40"
    ></div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Add User</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">First Name</label>
            <input v-model="formData.firstName" placeholder="John" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
            <input v-model="formData.lastName" placeholder="Doe" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input v-model="formData.email" type="email" placeholder="john@example.com" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="flex gap-2 mt-6 justify-end">
          <button @click="closeModals" class="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button @click="handleAddUser" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add User</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Edit User</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">First Name</label>
            <input v-model="formData.firstName" placeholder="John" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
            <input v-model="formData.lastName" placeholder="Doe" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input v-model="formData.email" type="email" placeholder="john@example.com" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="flex gap-2 mt-6 justify-end">
          <button @click="closeModals" class="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button @click="handleEditUser" class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Update</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Delete User</h2>
        <p class="text-slate-600 mb-6">Are you sure you want to delete <strong>{{ selectedUserName }}</strong>?</p>
        <div class="flex gap-2 justify-end">
          <button @click="closeModals" class="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button @click="handleDeleteUser" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
