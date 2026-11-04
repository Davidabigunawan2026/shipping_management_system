
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api/operators'

const operators = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')

const emptyForm = () => ({
  operator_id: null,
  operator_code: '',
  operator_name: '',
  country: '',
  contact_email: '',
  contact_phone: '',
  website: '',
  status: 'ACTIVE'
})

const form = ref(emptyForm())

// READ
async function loadOperators() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(API_URL)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load operators')
    }

    operators.value = result.data
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

// OPEN ADD FORM
function openAddForm() {
  isEditing.value = false
  form.value = emptyForm()
  errorMessage.value = ''
  showModal.value = true
}

// OPEN EDIT FORM
function openEditForm(operator) {
  isEditing.value = true
  form.value = { ...operator }
  errorMessage.value = ''
  showModal.value = true
}

// CLOSE FORM
function closeModal() {
  showModal.value = false
  form.value = emptyForm()
  errorMessage.value = ''
}

// CREATE / UPDATE
async function saveOperator() {
  if (!form.value.operator_code.trim() ||
      !form.value.operator_name.trim()) {
    errorMessage.value = 'Operator Code and Operator Name are required.'
    return
  }

  saving.value = true
  errorMessage.value = ''

  const editing = isEditing.value

  const url = editing
    ? `${API_URL}/${form.value.operator_id}`
    : API_URL

  const method = editing ? 'PUT' : 'POST'

  const payload = {
    operator_code: form.value.operator_code,
    operator_name: form.value.operator_name,
    country: form.value.country,
    contact_email: form.value.contact_email,
    contact_phone: form.value.contact_phone,
    website: form.value.website,
    status: form.value.status
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to save operator')
    }

    closeModal()
    await loadOperators()

    alert(editing
      ? 'Operator updated successfully!'
      : 'Operator added successfully!')

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    saving.value = false
  }
}

// DELETE
async function deleteOperator(operator) {
  const confirmed = confirm(
    `Delete operator "${operator.operator_name}"?`
  )

  if (!confirmed) return

  errorMessage.value = ''

  try {
    const response = await fetch(
      `${API_URL}/${operator.operator_id}`,
      { method: 'DELETE' }
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete operator')
    }

    await loadOperators()
    alert('Operator deleted successfully!')

  } catch (error) {
    alert(error.message)
  }
}

onMounted(loadOperators)
</script>

<template>
  <section class="operators-page">

    <div class="page-heading">
      <div>
        <h1>Ferry Operators</h1>
        <p>Manage ferry operator information</p>
      </div>

      <button class="add-button" @click="openAddForm">
        + Add Operator
      </button>
    </div>

    <div v-if="errorMessage && !showModal" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="table-card">
      <div class="table-heading">
        <h3>Operator List</h3>
        <span>{{ operators.length }} Operators</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Operator Name</th>
              <th>Country</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="empty-row">
                Loading operators...
              </td>
            </tr>

            <tr v-else-if="operators.length === 0">
              <td colspan="7" class="empty-row">
                No operators found.
              </td>
            </tr>

            <tr
              v-for="operator in operators"
              :key="operator.operator_id"
            >
              <td>{{ operator.operator_code }}</td>
              <td>{{ operator.operator_name }}</td>
              <td>{{ operator.country }}</td>
              <td>{{ operator.contact_email }}</td>
              <td>{{ operator.contact_phone }}</td>

              <td>
                <span
                  class="status"
                  :class="operator.status === 'ACTIVE'
                    ? 'active'
                    : 'inactive'"
                >
                  {{ operator.status }}
                </span>
              </td>

              <td>
                <div class="action-buttons">
                  <button
                    class="edit-button"
                    @click="openEditForm(operator)"
                  >
                    Edit
                  </button>

                  <button
                    class="delete-button"
                    @click="deleteOperator(operator)"
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

    <!-- ADD / EDIT MODAL -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-card">

        <div class="modal-heading">
          <div>
            <h2>{{ isEditing ? 'Edit Operator' : 'Add Operator' }}</h2>
            <p>Enter ferry operator information</p>
          </div>

          <button class="close-button" @click="closeModal">
            &times;
          </button>
        </div>

        <form @submit.prevent="saveOperator">

          <div class="form-grid">

            <div class="form-group">
              <label>Operator Code *</label>
              <input
                v-model="form.operator_code"
                placeholder="Example: OP006"
                required
              />
            </div>

            <div class="form-group">
              <label>Operator Name *</label>
              <input
                v-model="form.operator_name"
                placeholder="Enter operator name"
                required
              />
            </div>

            <div class="form-group">
              <label>Country</label>
              <input
                v-model="form.country"
                placeholder="Enter country"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                v-model="form.contact_email"
                type="email"
                placeholder="operator@email.com"
              />
            </div>

            <div class="form-group">
              <label>Phone</label>
              <input
                v-model="form.contact_phone"
                placeholder="+62..."
              />
            </div>

            <div class="form-group">
              <label>Website</label>
              <input
                v-model="form.website"
                placeholder="https://..."
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

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="cancel-button"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="save-button"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : (isEditing ? 'Update Operator' : 'Save Operator') }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </section>
</template>

<style scoped>
.operators-page {
  padding: 35px 40px;
  color: #e2e8f0;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
}

.page-heading h1 {
  font-size: 30px;
  margin: 0 0 8px;
  color: #f8fafc;
}

.page-heading p {
  margin: 0;
  color: #94a3b8;
}

.add-button,
.save-button {
  background: #14b8a6;
  color: #062b2b;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.add-button:hover,
.save-button:hover {
  background: #2dd4bf;
}

.table-card {
  background: #111f32;
  border: 1px solid #263b53;
  border-radius: 12px;
  overflow: hidden;
}

.table-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.table-heading h3 {
  margin: 0;
  color: #f1f5f9;
}

.table-heading span {
  color: #94a3b8;
  font-size: 13px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

th {
  background: #1a2b40;
  color: #2dd4bf;
  text-align: left;
  padding: 18px;
  font-size: 13px;
}

td {
  padding: 18px;
  border-top: 1px solid #263b53;
  color: #dbe5f1;
  font-size: 14px;
}

tbody tr:hover {
  background: #17283c;
}

.status {
  font-size: 12px;
  font-weight: 700;
}

.status.active {
  color: #2dd4bf;
}

.status.inactive {
  color: #fbbf24;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button,
.cancel-button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.edit-button {
  background: #1d4ed8;
  color: white;
}

.delete-button {
  background: #7f1d1d;
  color: #fecaca;
}

.empty-row {
  text-align: center;
  padding: 35px;
  color: #94a3b8;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(2, 8, 23, 0.78);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  background: #132238;
  border: 1px solid #2c435e;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.modal-heading h2 {
  margin: 0 0 7px;
}

.modal-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.close-button {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 28px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #cbd5e1;
  font-size: 13px;
}

.form-group input,
.form-group select {
  width: 100%;
  box-sizing: border-box;
  background: #0b1728;
  border: 1px solid #344b65;
  border-radius: 7px;
  padding: 12px;
  color: #f1f5f9;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2dd4bf;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.cancel-button {
  background: #334155;
  color: white;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error-message {
  background: #451a1a;
  color: #fecaca;
  padding: 12px;
  border-radius: 7px;
  margin: 15px 0;
  font-size: 13px;
}

@media (max-width: 700px) {
  .operators-page {
    padding: 20px 15px;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
