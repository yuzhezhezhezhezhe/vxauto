import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  {
    path: '/',
    component: Layout,
    name: 'Workspace',
    redirect: '/addWorkspace',
    children: [
      {
        path: 'addWorkspace',
        name: 'addWorkspace',
        component: () => import('@/views/workspace/index'),
        meta: { title: '工作空间', icon: 'el-icon-office-building' }
      }
    ]
  },

  {
    path: '/commodityWarehouse',
    component: Layout,
    name: 'CommodityWarehouse',
    meta: { title: '商品库', icon: 'el-icon-goods' },
    redirect: '/commodityWarehouse/JDWarehouse',
    children: [
      {
        path: 'JDWarehouse',
        name: 'JDWarehouse',
        component: () => import('@/views/warehouse/JDWarehouse/index'),
        meta: { title: '京东商品库', icon: 'el-icon-s-goods' }
      },
      {
        path: 'TBWorkspace',
        name: 'TBWorkspace',
        component: () => import('@/views/warehouse/TBWarehouse/flexbox'),
        meta: { title: '淘宝商品库', icon: 'el-icon-s-goods' }
      }
    ]
  },

  {
    path: '/taskList',
    component: Layout,
    name: 'TaskList',
    meta: { title: '任务列表', icon: 'el-icon-shopping-cart-2' },
    redirect: '/taskList',
    children: [
      {
        path: 'taskList',
        name: 'taskList',
        component: () => import('@/views/taskList/index'),
        meta: { title: '任务表', icon: 'el-icon-coin' }
      }
    ]
  },

  {
    path: '/loginHis',
    component: Layout,
    name: 'LoginHis',
    meta: { title: '访问记录', icon: 'el-icon-time' },
    redirect: '/loginHis',
    children: [
      {
        path: 'loginHis',
        name: 'loginHis',
        component: () => import('@/views/loginHis/index'),
        meta: { title: '访问记录', icon: 'el-icon-time' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
