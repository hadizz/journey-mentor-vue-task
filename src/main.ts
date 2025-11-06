import './assets/main.css'

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Create a query client with persistence configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
    },
  },
})

// Create persister for localStorage
const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'COUNTRIES_CACHE',
  throttleTime: 1000,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
  queryClient,
  clientPersister: (queryClient) => {
    return persistQueryClient({
      queryClient,
      persister,
    })
  },
  clientPersisterOnSuccess: () => {
    console.log('🚀 Query cache persisted successfully to localStorage')
    console.log(
      '📦 localStorage keys:',
      Object.keys(localStorage).filter((key) => key.includes('COUNTRIES')),
    )
  },
})

app.mount('#app')
