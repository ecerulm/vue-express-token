import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import About from '@/components/About.vue'

import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'


const routes = [
  { path: '/', component: Home},
  { path: '/about', component: About},
  { path: '/login', component: Login},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

export default router


