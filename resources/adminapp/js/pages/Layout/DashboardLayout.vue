<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <event-hub></event-hub>
    <side-bar :sidebarLinks="sidebarLinks">
      <mobile-menu slot="content"></mobile-menu>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>
      <div class="content">
        <dashboard-content></dashboard-content>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardContent from './Content.vue'
import TopNavbar from './TopNavbar.vue'
import MobileMenu from './MobileMenu.vue'

export default {
  components: {
    DashboardContent,
    TopNavbar,
    MobileMenu
  },
  data() {
    return {
      sidebarLinks: [
        {
          title: 'global.dashboard',
          icon: 'dashboard',
          path: { name: 'dashboard' }
        },
        {
          title: 'cruds.order.title',
          icon: 'table_view',
          path: { name: 'orders.index' },
          gate: 'order_access'
        },
        {
          title: 'cruds.service.title',
          icon: 'build',
          path: { name: 'services.index' },
          gate: 'service_access'
        },
        // {
        //   title: 'cruds.userManagement.title',
        //   icon: 'person',
        //   path: { name: 'user_management' },
        //   gate: 'user_management_access',
        //   children: [
        //     {
        //       title: 'cruds.user.title',
        //       icon: 'person',
        //       path: { name: 'users.index' },
        //       gate: 'user_access'
        //     }
        //   ]
        // }
      ]
    }
  }
}
</script>