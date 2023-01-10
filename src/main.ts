import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import generatedRoutes from '~pages'

import { sortPlugin } from '@/directives/sort'

import '@unocss/reset/tailwind.css'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(autoAnimatePlugin)
app.use(sortPlugin)

app.mount('#app')
