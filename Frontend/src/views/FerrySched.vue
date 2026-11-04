
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api'

const schedules = ref([])
const routes = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  schedule_id: null,
  schedule_code: '',
  route_id: '',
  vessel_name: '',
  departure_datetime: '',
  arrival_datetime: '',
  total_seats: 0,
  available_seats: 0,
  ticket_price: 0,
  status: 'SCHEDULED'
})

// Convert SQLite datetime to datetime-local format
function formatDateTime(value) {
  if (!value) return ''

  return value.replace(' ', 'T').slice(0, 16)
}

// GET Schedules
async function loadSchedules() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/schedules`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load schedules')
    }

    schedules.value = result.data || []

  } catch (error) {
    errorMessage.value = error.message
    console.error(error)

  } finally {
    loading.value = false
  }
}

// GET Routes for dropdown
async function loadRoutes() {
  try {
    const response = await fetch(`${API_URL}/routes`)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load routes')
    }

    routes.value = result.data || []

  } catch (error) {
    console.error('Load Routes Error:', error)
  }
}

// Reset form
function resetForm() {
  form.value = {
    schedule_id: null,
    schedule_code: '',
    route_id: '',
    vessel_name: '',
    departure_datetime: '',
    arrival_datetime: '',
    total_seats: 0,
    available_seats: 0,
    ticket_price: 0,
    status: 'SCHEDULED'
  }
}

// Add
function openAddModal() {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

// Edit
function openEditModal(schedule) {
  form.value = {
    schedule_id: schedule.schedule_id,
    schedule_code: schedule.schedule_code,
    route_id: schedule.route_id,
    vessel_name: schedule.vessel_name,
    departure_datetime: formatDateTime(schedule.departure_datetime),
    arrival_datetime: formatDateTime(schedule.arrival_datetime),
    total_seats: schedule.total_seats,
    available_seats: schedule.available_seats,
    ticket_price: schedule.ticket_price,
    status: schedule.status
  }

  isEditing.value = true
  showModal.value = true
}

// Save: POST or PUT
async function saveSchedule() {
  if (
    !form.value.schedule_code.trim() ||
    !form.value.route_id ||
    !form.value.vessel_name.trim() ||
    !form.value.departure_datetime ||
    !form.value.arrival_datetime
  ) {
    alert('Please complete all required fields.')
    return
  }

  if (form.value.available_seats > form.value.total_seats) {
    alert('Available seats cannot exceed total seats.')
    return
  }

  if (
    new Date(form.value.arrival_datetime) <=
    new Date(form.value.departure_datetime)
  ) {
    alert('Arrival must be later than departure.')
    return
  }

  saving.value = true

  try {
    const updating = isEditing.value

    const url = updating
      ? `${API_URL}/schedules/${form.value.schedule_id}`
      : `${API_URL}/schedules`

    const payload = {
      schedule_code: form.value.schedule_code.trim(),
      route_id: Number(form.value.route_id),
      vessel_name: form.value.vessel_name.trim(),
      departure_datetime: form.value.departure_datetime.replace('T', ' '),
      arrival_datetime: form.value.arrival_datetime.replace('T', ' '),
      total_seats: Number(form.value.total_seats),
      available_seats: Number(form.value.available_seats),
      ticket_price: Number(form.value.ticket_price),
      status: form.value.status
    }

    const response = await fetch(url, {
      method: updating ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to save schedule')
    }

    alert(result.message || 'Schedule saved successfully!')

    showModal.value = false
    resetForm()

    await loadSchedules()

  } catch (error) {
    alert(error.message)
    console.error('Save Schedule Error:', error)

  } finally {
    saving.value = false
  }
}

// Delete
async function deleteSchedule(schedule) {
  const confirmed = confirm(
    `Delete schedule ${schedule.schedule_code}?`
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `${API_URL}/schedules/${schedule.schedule_id}`,
      { method: 'DELETE' }
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to delete schedule')
    }

    alert(result.message || 'Schedule deleted successfully!')

    await loadSchedules()

  } catch (error) {
    alert(error.message)
    console.error('Delete Schedule Error:', error)
  }
}

function closeModal() {
  showModal.value = false
  resetForm()
}

// Initial Load
onMounted(() => {
  loadRoutes()
  loadSchedules()
})
</script>

<template>
  <section class="schedule-page">

    <!-- Heading -->
    <div class="page-heading">
      <div>
        <h1>Ferry Schedules Management</h1>
        <p>Manage vessel schedules and departure information</p>
      </div>

      <div class="heading-actions">
        <button
          class="btn-refresh"
          @click="loadSchedules"
          :disabled="loading"
        >
          ↻ Refresh
        </button>

        <button class="btn-add" @click="openAddModal">
          + Add Schedule
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button @click="loadSchedules">Retry</button>
    </div>

    <!-- Table -->
    <div class="table-card">

      <div class="table-header">
        <div>
          <h2>Schedule List</h2>
          <p>Vessel departure and arrival schedules</p>
        </div>

        <span class="schedule-count">
          {{ schedules.length }} Schedules
        </span>
      </div>

      <div v-if="loading" class="loading">
        Loading ferry schedules...
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Schedule Code</th>
              <th>Route</th>
              <th>Vessel</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Total Seats</th>
              <th>Available</th>
              <th>Ticket Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="schedule in schedules"
              :key="schedule.schedule_id"
            >
              <td class="schedule-code">
                {{ schedule.schedule_code }}
              </td>

              <td>
                {{ schedule.origin_port || '-' }}
                →
                {{ schedule.destination_port || '-' }}
              </td>

              <td>{{ schedule.vessel_name }}</td>
              <td>{{ schedule.departure_datetime }}</td>
              <td>{{ schedule.arrival_datetime }}</td>
              <td>{{ schedule.total_seats }}</td>
              <td>{{ schedule.available_seats }}</td>

              <td>
                Rp {{ Number(schedule.ticket_price).toLocaleString('id-ID') }}
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="schedule.status?.toLowerCase()"
                >
                  {{ schedule.status }}
                </span>
              </td>

              <td>
                <div class="action-buttons">
                  <button
                    class="btn-edit"
                    @click="openEditModal(schedule)"
                  >
                    Edit
                  </button>

                  <button
                    class="btn-delete"
                    @click="deleteSchedule(schedule)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="schedules.length === 0">
              <td colspan="10" class="empty-row">
                No schedules found.
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
              {{ isEditing ? 'Edit Ferry Schedule' : 'Add New Ferry Schedule' }}
            </h2>
            <p>Enter vessel and departure information</p>
          </div>

          <button class="btn-close" @click="closeModal">
            ×
          </button>
        </div>

        <form @submit.prevent="saveSchedule">

          <div class="form-grid">

            <div class="form-group">
              <label>Schedule Code *</label>
              <input
                v-model="form.schedule_code"
                placeholder="SCH006"
                required
              />
            </div>

            <div class="form-group">
              <label>Ferry Route *</label>
              <select v-model="form.route_id" required>
                <option value="" disabled>Select Route</option>

                <option
                  v-for="route in routes"
                  :key="route.route_id"
                  :value="route.route_id"
                >
                  {{ route.route_code }} —
                  {{ route.origin_port }} to {{ route.destination_port }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Vessel Name *</label>
              <input
                v-model="form.vessel_name"
                placeholder="Enter vessel name"
                required
              />
            </div>

            <div class="form-group">
              <label>Departure Date & Time *</label>
              <input
                v-model="form.departure_datetime"
                type="datetime-local"
                required
              />
            </div>

            <div class="form-group">
              <label>Arrival Date & Time *</label>
              <input
                v-model="form.arrival_datetime"
                type="datetime-local"
                required
              />
            </div>

            <div class="form-group">
              <label>Total Seats</label>
              <input
                v-model.number="form.total_seats"
                type="number"
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Available Seats</label>
              <input
                v-model.number="form.available_seats"
                type="number"
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Ticket Price (IDR)</label>
              <input
                v-model.number="form.ticket_price"
                type="number"
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
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
              {{
                saving
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Schedule'
                    : 'Save Schedule'
              }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </section>
</template>

<style scoped>
.schedule-page {
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
  font-size: 26px;
}

.page-heading p,
.table-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
}

.heading-actions,
.action-buttons {
  display: flex;
  gap: 9px;
}

button {
  cursor: pointer;
  font: inherit;
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
  padding: 9px 13px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.btn-refresh {
  background: #1b2d45;
  color: #a8b8ca;
}

.btn-add,
.btn-save {
  background: #0d9488;
  color: white;
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

.schedule-count {
  color: #2dd4bf;
  font-size: 12px;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1300px;
  border-collapse: collapse;
  white-space: nowrap;
}

th {
  padding: 15px;
  background: #1b2d45;
  color: #2dd4bf;
  text-align: left;
  font-size: 11px;
}

td {
  padding: 15px;
  border-top: 1px solid #263b55;
  color: #cbd5e1;
  font-size: 11px;
}

tbody tr:nth-child(even) {
  background: #17283e;
}

tbody tr:hover {
  background: #203650;
}

.schedule-code {
  color: #2dd4bf;
  font-weight: 600;
}

.status-badge {
  padding: 5px 9px;
  border-radius: 20px;
  background: #263b55;
  color: #94a3b8;
  font-size: 10px;
}

.status-badge.scheduled {
  background: #064e3b;
  color: #5eead4;
}

.status-badge.cancelled {
  background: #451a1a;
  color: #fca5a5;
}

.status-badge.completed {
  background: #1e3a5f;
  color: #93c5fd;
}

.btn-edit {
  background: #1e3a5f;
  color: #60a5fa;
}

.btn-delete {
  background: #451f2a;
  color: #f87171;
}

.loading,
.empty-row {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
}

.error-message {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 7px;
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
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  background: #111f33;
  border: 1px solid #304258;
  border-radius: 13px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
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
  font-size: 26px;
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
  padding: 11px;
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
}
</style>
