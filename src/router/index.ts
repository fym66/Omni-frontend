import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import BasicInfoView from '../views/BasicInfoView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import UploadView from '../views/UploadView.vue'
import WatchView from '../views/WatchView.vue'
import { hasPendingBasicInfo, isLoggedIn } from '../utils/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/',
      component: MainLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'watch/:videoId',
          name: 'watch',
          component: WatchView,
        },
        {
          path: 'upload',
          name: 'upload',
          component: UploadView,
        },
        {
          path: 'basic-info',
          name: 'basic-info',
          component: BasicInfoView,
          meta: {
            requiresAuth: false,
          },
        },
        {
          path: 'profile/:userId',
          name: 'profile',
          component: ProfileView,
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const loggedIn = isLoggedIn()
  const pendingBasicInfo = hasPendingBasicInfo()

  if (pendingBasicInfo && !loggedIn && to.name !== 'basic-info') {
    return '/basic-info'
  }

  if (to.name === 'basic-info' && !loggedIn && !pendingBasicInfo) {
    return '/login'
  }

  if (to.meta.requiresAuth && !loggedIn) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.guestOnly && loggedIn) {
    return '/'
  }

  return true
})

export default router
