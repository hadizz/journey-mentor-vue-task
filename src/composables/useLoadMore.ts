import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'

interface UseLoadMoreOptions<T> {
  items: Ref<T[] | undefined>
  pageSize?: number
  isLoading?: Ref<boolean>
  error?: Ref<unknown | null>
  rootMargin?: string
}

interface UseLoadMoreReturn<T> {
  visibleItems: ComputedRef<T[]>
  hasMore: ComputedRef<boolean>
  loadMore: () => void
  loadMoreTrigger: Ref<HTMLElement | null>
  visibleCount: Ref<number>
  reset: () => void
}

export function useLoadMore<T>({
  items,
  pageSize = 10,
  isLoading,
  error,
  rootMargin = '0px 0px 200px 0px',
}: UseLoadMoreOptions<T>): UseLoadMoreReturn<T> {
  const visibleCount = ref(pageSize)
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  const observer = ref<IntersectionObserver | null>(null)

  const visibleItems = computed<T[]>(() => {
    const list = items.value ?? []
    if (list.length <= visibleCount.value) {
      return list.slice()
    }
    return list.slice(0, visibleCount.value)
  })

  const hasMore = computed(() => {
    const total = items.value?.length ?? 0
    return total > visibleCount.value
  })

  const loadMore = () => {
    if (!hasMore.value) return
    const total = items.value?.length ?? 0
    visibleCount.value = Math.min(visibleCount.value + pageSize, total)
  }

  const reset = () => {
    const total = items.value?.length ?? 0
    visibleCount.value = Math.min(pageSize, total || pageSize)
  }

  const createObserver = () => {
    if (observer.value) return
    observer.value = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (isLoading?.value) return
        if (error?.value) return
        loadMore()
      },
      { rootMargin },
    )
  }

  onMounted(() => {
    createObserver()
    if (observer.value && loadMoreTrigger.value) {
      observer.value.observe(loadMoreTrigger.value)
    }
  })

  watch(
    () => loadMoreTrigger.value,
    (newEl, oldEl) => {
      if (!observer.value) {
        createObserver()
      }
      if (!observer.value) return

      if (oldEl) {
        observer.value.unobserve(oldEl)
      }

      if (newEl) {
        observer.value.observe(newEl)
      }
    },
  )

  watch(
    items,
    () => {
      reset()
    },
    { immediate: true },
  )

  watch(hasMore, (more) => {
    if (!observer.value || !loadMoreTrigger.value) return
    if (!more) {
      observer.value.unobserve(loadMoreTrigger.value)
      return
    }
    observer.value.observe(loadMoreTrigger.value)
  })

  onBeforeUnmount(() => {
    observer.value?.disconnect()
    observer.value = null
  })

  return {
    visibleItems,
    hasMore,
    loadMore,
    loadMoreTrigger,
    visibleCount,
    reset,
  }
}
