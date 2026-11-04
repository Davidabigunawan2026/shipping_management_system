
<script setup>
import { ref } from 'vue'

defineProps({
  activePage: {
    type: String,
    default: 'Dashboard'
  }
})

const emit = defineEmits(['navigate'])

const expandedMenus = ref([
  'Ferry Management',
  'Booking Management',
  'Payment Management'
])

const menus = [
  {
    title: 'Dashboard',
    icon: '▦',
    children: []
  },
  {
    title: 'Customer Management',
    icon: '♙',
    children: []
  },
  {
    title: 'Ferry Management',
    icon: '⛴',
    children: [
      'Ferry Operators',
      'Ferry Routes',
      'Ferry Schedules',
      'Vessel Management'
    ]
  },
  {
    title: 'Booking Management',
    icon: '▣',
    children: [
      'All Bookings',
      'Pending Bookings',
      'Confirmed Bookings',
      'Cancelled Bookings'
    ]
  },
  {
    title: 'Payment Management',
    icon: '▤',
    children: [
      'All Payments',
      'Payment Methods',
      'Payment Transactions',
      'Payment Webhooks'
    ]
  },
  {
    title: 'Reports',
    icon: '▥',
    children: [
      'Booking Reports',
      'Revenue Reports',
      'Payment Reports'
    ]
  },
  {
    title: 'Settings',
    icon: '⚙',
    children: [
      'User Management',
      'Roles & Permissions',
      'System Configuration'
    ]
  }
]

function toggleMenu(title) {
  if (expandedMenus.value.includes(title)) {
    expandedMenus.value = expandedMenus.value.filter(
      item => item !== title
    )
  } else {
    expandedMenus.value.push(title)
  }
}

function navigate(page) {
  emit('navigate', page)
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">⛴</div>

      <div class="brand-text">
        <h2>FERRY<span>_</span>BOOKING</h2>
        <small>ADMIN MANAGEMENT</small>
      </div>
    </div>

    <div class="menu-heading">MAIN MENU</div>

    <nav class="menu-list">
      <div
        v-for="menu in menus"
        :key="menu.title"
        class="menu-group"
      >
        <div
          class="menu-item"
          :class="{
            active: activePage === menu.title
              || menu.children.includes(activePage)
          }"
          @click="
            menu.children.length
              ? toggleMenu(menu.title)
              : navigate(menu.title)
          "
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-label">{{ menu.title }}</span>

          <span
            v-if="menu.children.length"
            class="arrow"
            :class="{
              rotated: expandedMenus.includes(menu.title)
            }"
          >
            ›
          </span>
        </div>

        <div
          v-if="menu.children.length && expandedMenus.includes(menu.title)"
          class="submenu"
        >
          <div
            v-for="child in menu.children"
            :key="child"
            class="submenu-item"
            :class="{ active: activePage === child }"
            @click="navigate(child)"
          >
            <span class="submenu-dot"></span>
            {{ child }}
          </div>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="online-dot"></div>
      <span>System Online</span>
      <small>v1.0.0</small>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #101d30;
  border-right: 1px solid #24364c;
  display: flex;
  flex-direction: column;
  color: #a8b8ca;
}

.brand {
  height: 85px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #24364c;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #123e45;
  color: #2dd4bf;
  display: grid;
  place-items: center;
  font-size: 23px;
}

.brand-text h2 {
  color: #f1f5f9;
  font-size: 15px;
  letter-spacing: 1px;
  margin: 0;
}

.brand-text h2 span {
  color: #2dd4bf;
}

.brand-text small {
  color: #71859b;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.menu-heading {
  padding: 25px 22px 12px;
  color: #61758c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.menu-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.menu-item {
  min-height: 44px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.menu-item:hover {
  background: #1b3047;
  color: #fff;
}

.menu-item.active {
  background: #123e45;
  color: #2dd4bf;
  font-weight: 600;
}

.menu-icon {
  width: 20px;
  text-align: center;
  font-size: 17px;
}

.menu-label {
  flex: 1;
}

.arrow {
  font-size: 21px;
  transition: transform 0.2s;
}

.arrow.rotated {
  transform: rotate(90deg);
}

.submenu {
  padding: 5px 0 8px 42px;
}

.submenu-item {
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.submenu-item:hover,
.submenu-item.active {
  color: #2dd4bf;
}

.submenu-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #52677e;
}

.submenu-item.active .submenu-dot {
  background: #2dd4bf;
}

.sidebar-footer {
  height: 55px;
  padding: 0 20px;
  border-top: 1px solid #24364c;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
}

.online-dot {
  width: 7px;
  height: 7px;
  background: #2dd4bf;
  border-radius: 50%;
}

.sidebar-footer small {
  margin-left: auto;
  color: #71859b;
}
</style>
