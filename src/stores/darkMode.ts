import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'

const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false

  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) {
    return JSON.parse(savedMode)
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = useLocalStorage('darkMode', getInitialDarkMode())

  const applyDarkMode = (dark: boolean) => {
    if (typeof document === 'undefined') return

    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  watch(
    isDarkMode,
    (newValue) => {
      console.log('Dark mode changed:', newValue)
      applyDarkMode(newValue)
    },
    { immediate: false },
  )

  const toggleDarkMode = () => {
    console.log('toggleDarkMode')
    isDarkMode.value = !isDarkMode.value
  }

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value
  }

  return {
    isDarkMode: computed(() => isDarkMode.value),
    toggleDarkMode,
    setDarkMode,
  }
})
