
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api'

const routes = ref([])
const operators = ref([])

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  route_id: null,
  route_code: '',
  operator_id: '',
  origin_port: '',
  destination_port: '',
  origin_country: '',
  destination_country: '',
  duration_minutes: 0,
  status: 'ACTIVE'
})

// Load Ferry Routes
async function loadRoutes() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/routes`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load routes')
    }

    routes.value = result.data || []

  } catch (error) {
    errorMessage.value = error.message
    console.error(error)

  } finally {
    loading.value = false
  }
}

// Load Ferry Operators for dropdown
async function loadOperators() {
  try {
    const response = await fetch(`${API_URL}/operators`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load operators')
    }

    operators.value = result.data || []

  } catch (error) {
    console.error('Load Operators Error:', error)
  }
}

// Reset form
function resetForm() {
  form.value = {
    route_id: null,
    route_code: '',
    operator_id: '',
    origin_port: '',
    destination_port: '',
    origin_country: '',
    destination_country: '',
    duration_minutes: 0,
    status: 'ACTIVE'
  }
}

// Open Add Modal
function openAddModal() {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

// Open Edit Modal
function openEditModal(route) {
  form.value = {
    route_id: route.route_id,
    route_code: route.route_code,
    operator_id: route.operator_id,
    origin_port: route.origin_port,
    destination_port: route.destination_port,
    origin_country: route.origin_country,
    destination_country: route.destination_country,
    duration_minutes: route.duration_minutes,
    status: route.status
  }

  isEditing.value = true
  showModal.value = true
}

// Save Route: POST or PUT
async function saveRoute() {
  if (
    !form.value.route_code.trim() ||
    !form.value.operator_id ||
    !form.value.origin_port.trim() ||
    !form.value.destination_port.trim() ||
    !form.value.origin_country.trim() ||
    !form.value.destination_country.trim()
  ) {
    alert('Please complete all required fields.')
    return
  }

  saving.value = true

  try {
    const isUpdate = isEditing.value

    const url = isUpdate
      ? `${API_URL}/routes/${form.value.route_id}`
      : `${API_URL}/routes`

    const method = isUpdate ? 'PUT' : 'POST'

    const payload = {
      route_code: form.value.route_code.trim(),
      operator_id: Number(form.value.operator_id),
      origin_port: form.value.origin_port.trim(),
      destination_port: form.value.destination_port.trim(),
      origin_country: form.value.origin_country.trim(),
      destination_country: form.value.destination_country.trim(),
      duration_minutes: Number(form.value.duration_minutes) || 0,
      status: form.value.status
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to save route')
    }

    alert(result.message || 'Route saved successfully!')

    showModal.value = false
    resetForm()

    await loadRoutes()

  } catch (error) {
    alert(error.message)
    console.error('Save Route Error:', error)

  } finally {
    saving.value = false
  }
}

// Delete Route
async function deleteRoute(route) {
  const confirmed = confirm(
    `Are you sure you want to delete route ${route.route_code}?`
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `${API_URL}/routes/${route.route_id}`,
      {
        method: 'DELETE'
      }
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to delete route')
    }

    alert(result.message || 'Route deleted successfully!')

    await loadRoutes()

  } catch (error) {
    alert(error.message)
    console.error('Delete Route Error:', error)
  }
}

// Close Modal
function closeModal() {
  showModal.value = false
  resetForm()
}

// Initial Load
onMounted(() => {
  loadOperators()
  loadRoutes()
})
</script>

<template>
  <section class="routes-page">

    <!-- Page Heading -->
    <div class="page-heading">
      <div>
        <h1>Ferry Routes</h1>
        <p>Manage ferry route information</p>
      </div>

      <div class="heading-actions">
        <button
          class="btn-refresh"
          @click="loadRoutes"
          :disabled="loading"
        >
          ↻ Refresh
        </button>

        <button class="btn-add" @click="openAddModal">
          + Add Route
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button @click="loadRoutes">Retry</button>
    </div>

    <!-- Route Table -->
    <div class="table-card">

      <div class="table-header">
        <div>
          <h2>Route List</h2>
          <p>Ferry route master data</p>
        </div>

        <span class="route-count">
          {{ routes.length }} Routes
        </span>
      </div>

      <div v-if="loading" class="loading">
        Loading ferry routes...
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Route Code</th>
              <th>Operator</th>
              <th>Origin Port</th>
              <th>Destination Port</th>
              <th>Origin Country</th>
              <th>Destination Country</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="route in routes"
              :key="route.route_id"
            >
              <td class="route-code">
                {{ route.route_code }}
              </td>

              <td>{{ route.operator_name || '-' }}</td>
              <td>{{ route.origin_port }}</td>
              <td>{{ route.destination_port }}</td>
              <td>{{ route.origin_country }}</td>
              <td>{{ route.destination_country }}</td>
              <td>{{ route.duration_minutes }} min</td>

              <td>
                <span
                  class="status-badge"
                  :class="route.status?.toLowerCase()"
                >
                  {{ route.status }}
                </span>
              </td>

              <td>
                <div class="action-buttons">
                  <button
                    class="btn-edit"
                    @click="openEditModal(route)"
                  >
                    Edit
                  </button>

                  <button
                    class="btn-delete"
                    @click="deleteRoute(route)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="routes.length === 0">
              <td colspan="9" class="empty-row">
                No routes found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Add / Edit Modal -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-card">

        <div class="modal-header">
          <div>
            <h2>
              {{ isEditing ? 'Edit Ferry Route' : 'Add New Ferry Route' }}
            </h2>
            <p>
              {{ isEditing ? 'Update route information' : 'Enter new route information' }}
            </p>
          </div>

          <button class="btn-close" @click="closeModal">
            ×
          </button>
        </div>

        <form @submit.prevent="saveRoute">

          <div class="form-grid">

            <div class="form-group">
              <label>Route Code *</label>
              <input
                v-model="form.route_code"
                type="text"
                placeholder="Example: RTE006"
                required
              />
            </div>

            <div class="form-group">
              <label>Ferry Operator *</label>
              <select
                v-model="form.operator_id"
                required
              >
                <option value="" disabled>
                  Select Operator
                </option>

                <option
                  v-for="operator in operators"
                  :key="operator.operator_id"
                  :value="operator.operator_id"
                >
                  {{ operator.operator_name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Origin Port *</label>
              <input
                v-model="form.origin_port"
                type="text"
                placeholder="Origin port"
                required
              />
            </div>

            <div class="form-group">
              <label>Destination Port *</label>
              <input
                v-model="form.destination_port"
                type="text"
                placeholder="Destination port"
                required
              />
            </div>

            <div class="form-group">
              <label>Origin Country *</label>
              <input
                v-model="form.origin_country"
                type="text"
                placeholder="Origin country"
                required
              />
            </div>

            <div class="form-group">
              <label>Destination Country *</label>
              <input
                v-model="form.destination_country"
                type="text"
                placeholder="Destination country"
                required
              />
            </div>

            <div class="form-group">
              <label>Duration (Minutes)</label>
              <input
                v-model.number="form.duration_minutes"
                type="number"
                min="0"
                placeholder="Example: 70"
              />
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-cancel"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn-save"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : (isEditing ? 'Update Route' : 'Save Route') }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </section>
</template>

<style scoped>
.routes-page {
  padding: 10px 0;
  color: #e2e8f0;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.page-heading h1 {
  margin: 0 0 8px;
  color: #f1f5f9;
  font-size: 28px;
}

.page-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.heading-actions {
  display: flex;
  gap: 10px;
}

button {
  font: inherit;
  cursor: pointer;
  transition: 0.2s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-refresh,
.btn-add,
.btn-edit,
.btn-delete,
.btn-save,
.btn-cancel {
  border: none;
  border-radius: 7px;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: 600;
}

.btn-refresh {
  background: #1b2d45;
  color: #a8b8ca;
  border: 1px solid #304258;
}

.btn-add,
.btn-save {
  background: #0d9488;
  color: #ffffff;
}

.btn-add:hover,
.btn-save:hover {
  background: #0f766e;
}

.table-card {
  background: #111f33;
  border: 1px solid #263b55;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  background: #132238;
}

.table-header h2 {
  margin: 0 0 6px;
  font-size: 17px;
}

.table-header p {
  margin: 0;
  color: #8294a9;
  font-size: 11px;
}

.route-count {
  color: #2dd4bf;
  font-size: 13px;
  font-weight: 600;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1150px;
  border-collapse: collapse;
  white-space: nowrap;
}

th {
  background: #1b2d45;
  color: #2dd4bf;
  text-align: left;
  padding: 15px;
  font-size: 11px;
  font-weight: 600;
}

td {
  padding: 16px 15px;
  border-top: 1px solid #263b55;
  font-size: 12px;
  color: #cbd5e1;
}

tbody tr:nth-child(even) {
  background: #17283e;
}

tbody tr:hover {
  background: #203650;
}

.route-code {
  color: #2dd4bf;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  background: #263b55;
  color: #94a3b8;
}

.status-badge.active {
  background: #064e3b;
  color: #5eead4;
}

.status-badge.inactive {
  background: #451a1a;
  color: #fca5a5;
}

.action-buttons {
  display: flex;
  gap: 7px;
}

.btn-edit {
  background: #1e3a5f;
  color: #60a5fa;
  padding: 7px 12px;
}

.btn-delete {
  background: #451f2a;
  color: #f87171;
  padding: 7px 12px;
}

.btn-edit:hover {
  background: #274c77;
}

.btn-delete:hover {
  background: #7f1d1d;
}

.loading,
.empty-row {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

.error-message {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #7f1d1d;
  border-radius: 8px;
  background: #451a1a;
  color: #fca5a5;
  font-size: 12px;
}

.error-message button {
  margin-left: 10px;
  border: none;
  background: transparent;
  color: #5eead4;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(2, 8, 23, 0.8);
  overflow-y: auto;
}

.modal-card {
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  background: #111f33;
  border: 1px solid #304258;
  border-radius: 13px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px 25px;
  border-bottom: 1px solid #263b55;
}

.modal-header h2 {
  margin: 0 0 7px;
  color: #f1f5f9;
  font-size: 18px;
}

.modal-header p {
  margin: 0;
  color: #8294a9;
  font-size: 11px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 27px;
  line-height: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #a8b8ca;
  font-size: 11px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 11px 12px;
  background: #0b1422;
  border: 1px solid #304258;
  border-radius: 6px;
  color: #e2e8f0;
  font: inherit;
  font-size: 12px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2dd4bf;
}

.form-group input::placeholder {
  color: #64748b;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 25px;
  border-top: 1px solid #263b55;
}

.btn-cancel {
  background: #263b55;
  color: #cbd5e1;
}

@media (max-width: 700px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    max-height: 95vh;
  }
}
</style>
