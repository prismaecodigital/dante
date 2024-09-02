import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const View = { template: '<router-view></router-view>' }

const routes = [
  {
    path: '/',
    component: () => import('@pages/Layout/DashboardLayout.vue'),
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@pages/Dashboard.vue'),
        meta: { title: 'global.dashboard' }
      },
      {
        path: 'orders',
        name: 'orders.index',
        component: () => import('@cruds/Orders/Index.vue'),
        meta: { title: 'cruds.order.title' }
      },
      {
        path: 'orders/create',
        name: 'orders.create',
        component: () => import('@cruds/Orders/Create.vue'),
        meta: { title: 'cruds.order.title' }
      },
      {
        path: 'orders/:id',
        name: 'orders.show',
        component: () => import('@cruds/Orders/Show.vue'),
        meta: { title: 'cruds.order.title' }
      },
      {
        path: 'orders/:id/edit',
        name: 'orders.edit',
        component: () => import('@cruds/Orders/Edit.vue'),
        meta: { title: 'cruds.order.title' }
      },
      {
        path: 'services',
        name: 'services.index',
        component: () => import('@cruds/Services/Index.vue'),
        meta: { title: 'cruds.service.title' }
      },
      {
        path: 'services/create',
        name: 'services.create',
        // component: () => import('@cruds/Services/Create.vue'),
        meta: { title: 'cruds.service.title' }
      },
      {
        path: 'user-management',
        name: 'user_management',
        component: View,
        redirect: { name: 'users.index' },
        children: [
          {
            path: 'users',
            name: 'users.index',
            component: () => import('@cruds/Users/Index.vue'),
            meta: { title: 'cruds.user.title' }
          },
          {
            path: 'users/create',
            name: 'users.create',
            component: () => import('@cruds/Users/Create.vue'),
            meta: { title: 'cruds.user.title' }
          },
          {
            path: 'users/:id',
            name: 'users.show',
            component: () => import('@cruds/Users/Show.vue'),
            meta: { title: 'cruds.user.title' }
          },
          {
            path: 'users/:id/edit',
            name: 'users.edit',
            component: () => import('@cruds/Users/Edit.vue'),
            meta: { title: 'cruds.user.title' }
          }
        ]
      }
    ]
  }
]

export default new VueRouter({
  mode: 'history',
  base: '/admin',
  routes
})