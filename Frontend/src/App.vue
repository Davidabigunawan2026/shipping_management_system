
<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import FerryOperators from './views/FerryOperators.vue'
import FerryRoutes from './views/FerryRoutes.vue'
import FerrySched from './views/FerrySched.vue'

const activePage = ref('Dashboard')

const stats = [
  {
    title: 'Total Bookings',
    value: '1,284',
    change: '+12.5%',
    icon: '▣'
  },
  {
    title: 'Total Customers',
    value: '856',
    change: '+8.2%',
    icon: '♙'
  },
  {
    title: 'Total Revenue',
    value: 'Rp 185.5M',
    change: '+15.3%',
    icon: '▤'
  },
  {
    title: 'Pending Payments',
    value: '24',
    change: 'Needs attention',
    icon: '◷'
  }
]

const recentBookings = [
  {
    code: 'BK001',
    customer: 'David Anderson',
    route: 'Singapore - Batam',
    date: '04 Nov 2026',
    amount: 'Rp 900,000',
    status: 'Pending'
  },
  {
    code: 'BK002',
    customer: 'Michael Tan',
    route: 'Singapore - Batam',
    date: '04 Nov 2026',
    amount: 'Rp 450,000',
    status: 'Confirmed'
  },
  {
    code: 'BK003',
    customer: 'Sarah Johnson',
    route: 'Batam - Singapore',
    date: '05 Nov 2026',
    amount: 'Rp 900,000',
    status: 'Confirmed'
  },
  {
    code: 'BK004',
    customer: 'Budi Santoso',
    route: 'Merak - Bakauheni',
    date: '05 Nov 2026',
    amount: 'Rp 450,000',
    status: 'Completed'
  }
]

function selectPage(page) {
  activePage.value = page
}
</script>

<template>
  <div class="app-layout">
    <Sidebar
      :active-page="activePage"
      @navigate="selectPage"
    />

    <main class="main-content">
      <header class="top-navbar">
        <div class="page-info">
          <span class="breadcrumb">Ferry Booking</span>
          <span class="breadcrumb-separator">/</span>
          <strong>{{ activePage }}</strong>
        </div>

        <div class="navbar-right">
          <button class="icon-button" title="Notifications">
            ♧
            <span class="notification-dot"></span>
          </button>

          <div class="profile">
            <div class="avatar">AD</div>
            <div class="profile-info">
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
            <span class="profile-arrow">⌄</span>
          </div>
        </div>
      </header>

      <section class="page-container">
        <template v-if="activePage === 'Dashboard'">
          <div class="welcome-section">
            <div>
              <h1>Dashboard Overview</h1>
              <p>
                Welcome back! Here's what's happening with your ferry business.
              </p>
            </div>

            <div class="date-label">
              <span>▦</span> November 2026
            </div>
          </div>

          <div class="stats-grid">
            <div
              v-for="(stat, index) in stats"
              :key="stat.title"
              class="stat-card"
            >
              <div class="stat-top">
                <span class="stat-title">{{ stat.title }}</span>
                <div class="stat-icon" :class="'icon-' + index">
                  {{ stat.icon }}
                </div>
              </div>

              <h2>{{ stat.value }}</h2>

              <span class="stat-change">{{ stat.change }}</span>
            </div>
          </div>

          <div class="content-grid">
            <div class="panel revenue-panel">
              <div class="panel-header">
                <div>
                  <h3>Revenue Overview</h3>
                  <p>Monthly revenue performance</p>
                </div>

                <span class="period-label">Last 6 Months⌄</span>
              </div>

              <div class="chart-placeholder">
                <div class="chart-values">
                  <span>200M</span>
                  <span>150M</span>
                  <span>100M</span>
                  <span>50M</span>
                  <span>0</span>
                </div>

                <div class="chart-area">
                  <div
                    v-for="(height, index) in [42, 60, 48, 75, 65, 90]"
                    :key="index"
                    class="chart-column"
                  >
                    <div
                      class="chart-bar"
                      :style="{ height: height + '%' }"
                    ></div>
                    <span>
                      {{ ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][index] }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel booking-summary">
              <div class="panel-header">
                <div>
                  <h3>Booking Status</h3>
                  <p>Current booking distribution</p>
                </div>
              </div>

              <div class="status-item">
                <span class="status-circle confirmed-circle"></span>
                <span>Confirmed</span>
                <strong>65%</strong>
              </div>

              <div class="status-track">
                <div class="status-fill confirmed-fill"></div>
              </div>

              <div class="status-item">
                <span class="status-circle pending-circle"></span>
                <span>Pending</span>
                <strong>25%</strong>
              </div>

              <div class="status-track">
                <div class="status-fill pending-fill"></div>
              </div>

              <div class="status-item">
                <span class="status-circle cancelled-circle"></span>
                <span>Cancelled</span>
                <strong>10%</strong>
              </div>

              <div class="status-track">
                <div class="status-fill cancelled-fill"></div>
              </div>
            </div>
          </div>

          <div class="panel table-panel">
            <div class="panel-header">
              <div>
                <h3>Recent Bookings</h3>
                <p>Latest customer booking transactions</p>
              </div>

              <button
                class="view-all"
                @click="selectPage('All Bookings')"
              >
                View All →
              </button>
            </div>

            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking Code</th>
                    <th>Customer</th>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="booking in recentBookings"
                    :key="booking.code"
                  >
                    <td class="booking-code">{{ booking.code }}</td>
                    <td>{{ booking.customer }}</td>
                    <td>{{ booking.route }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.amount }}</td>
                    <td>
                      <span
                        class="status-badge"
                        :class="booking.status.toLowerCase()"
                      >
                        {{ booking.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>



        <FerryOperators
          v-else-if="activePage === 'Ferry Operators'"
        />

        <FerryRoutes
          v-else-if="activePage === 'Ferry Routes'"
        />

        <FerrySched
          v-else-if="activePage === 'Ferry Schedules'"
        />



        <div v-else class="panel placeholder-panel">
          <div class="placeholder-icon">⛴</div>
          <h2>{{ activePage }}</h2>
          <p>
            This module is ready for development.
            We will connect it to the SQLite database and API.
          </p>
        </div>






        <footer class="page-footer">
          © 2026 Ferry Booking Management System
          <span>Powered by Vue 3 + Node.js</span>
        </footer>
      </section>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  background: #0b1422;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button {
  font: inherit;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  background: #0b1422;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.top-navbar {
  height: 75px;
  padding: 0 32px;
  background: #111e30;
  border-bottom: 1px solid #24364c;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.breadcrumb {
  color: #8294a9;
}

.breadcrumb-separator {
  color: #52677e;
}

.page-info strong {
  color: #2dd4bf;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.icon-button {
  position: relative;
  background: transparent;
  border: none;
  color: #a8b8ca;
  font-size: 21px;
  cursor: pointer;
}

.notification-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #f59e0b;
  border-radius: 50%;
  top: 2px;
  right: 1px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #164e56;
  color: #2dd4bf;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.profile-info small {
  color: #8294a9;
  font-size: 10px;
}

.profile-arrow {
  color: #8294a9;
}

.page-container {
  padding: 30px 32px;
  max-width: 1600px;
  margin: auto;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.welcome-section h1 {
  font-size: 23px;
  margin: 0 0 8px;
  color: #f1f5f9;
}

.welcome-section p,
.panel-header p {
  color: #8294a9;
  font-size: 12px;
  margin: 0;
}

.date-label,
.period-label {
  border: 1px solid #304258;
  background: #111e30;
  border-radius: 7px;
  padding: 10px 13px;
  color: #a8b8ca;
  font-size: 11px;
}

.date-label span {
  color: #2dd4bf;
  margin-right: 7px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.stat-card,
.panel {
  background: #111e30;
  border: 1px solid #24364c;
  border-radius: 11px;
}

.stat-card {
  padding: 20px;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  color: #9aabc0;
  font-size: 12px;
}

.stat-icon {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  font-size: 19px;
  background: #153b42;
  color: #2dd4bf;
}

.icon-1 {
  background: #1c3451;
  color: #60a5fa;
}

.icon-2 {
  background: #3c304b;
  color: #c084fc;
}

.icon-3 {
  background: #443a24;
  color: #fbbf24;
}

.stat-card h2 {
  color: #f1f5f9;
  font-size: 25px;
  margin: 20px 0 9px;
}

.stat-change {
  color: #2dd4bf;
  font-size: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 20px;
  margin-bottom: 22px;
}

.panel {
  padding: 22px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.panel-header h3 {
  font-size: 14px;
  margin: 0 0 7px;
  color: #f1f5f9;
}

.period-label {
  padding: 8px 10px;
}

.chart-placeholder {
  height: 205px;
  display: flex;
  gap: 15px;
}

.chart-values {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #71859b;
  font-size: 10px;
  padding-bottom: 24px;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 15px;
  border-bottom: 1px solid #304258;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 49px,
    #24364c 50px
  );
}

.chart-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
}

.chart-bar {
  width: min(35px, 75%);
  background: linear-gradient(180deg, #2dd4bf, #126c70);
  border-radius: 5px 5px 0 0;
  min-height: 10px;
}

.chart-column span {
  font-size: 10px;
  color: #8294a9;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 20px 0 9px;
  font-size: 11px;
  color: #a8b8ca;
}

.status-item strong {
  margin-left: auto;
  color: #e2e8f0;
}

.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.confirmed-circle,
.confirmed-fill {
  background: #2dd4bf;
}

.pending-circle,
.pending-fill {
  background: #fbbf24;
}

.cancelled-circle,
.cancelled-fill {
  background: #f87171;
}

.status-track {
  height: 5px;
  background: #26384e;
  border-radius: 5px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: 5px;
}

.confirmed-fill {
  width: 65%;
}

.pending-fill {
  width: 25%;
}

.cancelled-fill {
  width: 10%;
}

.table-panel {
  margin-bottom: 25px;
}

.view-all {
  color: #2dd4bf;
  background: transparent;
  border: none;
  font-size: 11px;
  cursor: pointer;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th {
  text-align: left;
  color: #71859b;
  font-size: 10px;
  font-weight: 600;
  padding: 12px 10px;
  border-bottom: 1px solid #304258;
}

td {
  padding: 15px 10px;
  color: #b8c5d5;
  font-size: 11px;
  border-bottom: 1px solid #24364c;
}

tbody tr:last-child td {
  border-bottom: none;
}

.booking-code {
  color: #2dd4bf;
  font-weight: 600;
}

.status-badge {
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
}

.status-badge.pending {
  background: #443a24;
  color: #fbbf24;
}

.status-badge.confirmed {
  background: #153b42;
  color: #2dd4bf;
}

.status-badge.completed {
  background: #1c3451;
  color: #60a5fa;
}

.status-badge.cancelled {
  background: #472b32;
  color: #f87171;
}

.placeholder-panel {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.placeholder-icon {
  font-size: 42px;
  color: #2dd4bf;
  margin-bottom: 15px;
}

.placeholder-panel h2 {
  color: #f1f5f9;
}

.placeholder-panel p {
  max-width: 400px;
  color: #8294a9;
  font-size: 12px;
  line-height: 1.7;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  color: #61758c;
  font-size: 10px;
  padding: 12px 0;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
  }

  .brand {
    padding: 0;
    justify-content: center;
  }

  .brand-text,
  .menu-heading,
  .menu-label,
  .arrow,
  .submenu,
  .sidebar-footer {
    display: none;
  }

  .menu-list {
    padding: 10px 6px;
  }

  .menu-item {
    justify-content: center;
    padding: 0;
  }

  .top-navbar {
    padding: 0 14px;
  }

  .profile-info,
  .profile-arrow {
    display: none;
  }

  .page-container {
    padding: 20px 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    align-items: flex-start;
    gap: 15px;
    flex-direction: column;
  }

  .page-footer {
    gap: 8px;
    flex-direction: column;
  }
}
</style>
