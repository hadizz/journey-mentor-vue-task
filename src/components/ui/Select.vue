<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  helpText?: string
  id?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option...',
  modelValue: '',
  options: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const attrs = useAttrs()
const selectRef = ref<HTMLDivElement>()
const dropdownRef = ref<HTMLDivElement>()
const isOpen = ref(false)
const focusedIndex = ref(-1)

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => [
  'select__trigger',
  {
    'select__trigger--disabled': props.disabled,
    'select__trigger--open': isOpen.value,
  },
])

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)
})

const displayValue = computed(() => {
  return selectedOption.value?.label || props.placeholder
})

const isPlaceholder = computed(() => {
  return !selectedOption.value
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    focusedIndex.value = props.modelValue
      ? props.options.findIndex((option) => option.value === props.modelValue)
      : -1
  }
}

const selectOption = (option: SelectOption) => {
  if (props.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  focusedIndex.value = -1
  selectRef.value?.focus()
}

const clearSelection = (event: Event) => {
  event.stopPropagation()
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('change', '')
  selectRef.value?.focus()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown()
      } else if (focusedIndex.value >= 0) {
        selectOption(props.options[focusedIndex.value] as SelectOption)
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        isOpen.value = false
        focusedIndex.value = -1
        selectRef.value?.focus()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        toggleDropdown()
      } else {
        focusedIndex.value = Math.min(focusedIndex.value + 1, props.options.length - 1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      }
      break
    case 'Tab':
      if (isOpen.value) {
        isOpen.value = false
        focusedIndex.value = -1
      }
      break
    case 'Delete':
    case 'Backspace':
      if (!isOpen.value && selectedOption.value) {
        event.preventDefault()
        clearSelection(event)
      }
      break
  }
}

const handleBlur = (event: FocusEvent) => {
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!selectRef.value?.contains(relatedTarget) && !dropdownRef.value?.contains(relatedTarget)) {
      isOpen.value = false
      focusedIndex.value = -1
      emit('blur', event)
    }
  }, 150)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleClickOutside = (event: MouseEvent) => {
  setTimeout(() => {
    const target = event.target as HTMLElement
    if (!selectRef.value?.contains(target) && !dropdownRef.value?.contains(target)) {
      isOpen.value = false
      focusedIndex.value = -1
    }
  }, 100)
}

const focus = () => {
  selectRef.value?.focus()
}

const blur = () => {
  selectRef.value?.blur()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  focus,
  blur,
  selectRef,
})
</script>

<template>
  <div class="select">
    <label
      v-if="label"
      :for="selectId"
      class="select__label"
      :class="{ 'select__label--required': required }"
    >
      {{ label }}
      <span v-if="required" class="select__required" aria-label="required">*</span>
    </label>

    <div class="select__wrapper">
      <div
        :id="selectId"
        ref="selectRef"
        :class="selectClasses"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-labelledby="label ? `${selectId}-label` : undefined"
        :aria-describedby="helpText ? `${selectId}-help` : undefined"
        :aria-required="required"
        :aria-disabled="disabled"
        role="combobox"
        v-bind="attrs"
        @click="toggleDropdown"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <span class="select__value" :class="{ 'select__value--placeholder': isPlaceholder }">
          {{ displayValue }}
        </span>

        <div class="select__actions">
          <button
            v-if="selectedOption && !disabled"
            type="button"
            class="select__clear"
            aria-label="Clear selection"
            @click="clearSelection"
            @mousedown.prevent
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="select__arrow" :class="{ 'select__arrow--open': isOpen }" aria-hidden="true">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="select__dropdown"
        role="listbox"
        :aria-labelledby="label ? `${selectId}-label` : undefined"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          class="select__option"
          :class="{
            'select__option--selected': option.value === modelValue,
            'select__option--focused': index === focusedIndex,
          }"
          role="option"
          :aria-selected="option.value === modelValue"
          @mousedown.prevent
          @click.stop="selectOption(option)"
          @mouseenter="focusedIndex = index"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <div v-if="helpText" :id="`${selectId}-help`" class="select__help">
      {{ helpText }}
    </div>
  </div>
</template>

<style scoped>
.select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.select__label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.select__label--required {
  color: #374151;
}

.select__required {
  color: #ef4444;
  font-weight: 600;
}

.select__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select__trigger {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  gap: 8px;
}

.select__trigger:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select__trigger:hover:not(.select__trigger--disabled) {
  border-color: #9ca3af;
}

.select__trigger--open {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select__trigger--disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.select__value {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select__value--placeholder {
  color: #9ca3af;
}

.select__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.select__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  padding: 0;
}

.select__clear:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.select__clear:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}

.select__trigger--disabled .select__clear {
  color: #9ca3af;
  cursor: not-allowed;
}

.select__trigger--disabled .select__clear:hover {
  background-color: transparent;
}

.select__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease-in-out;
  transform: rotate(0deg);
}

.select__arrow--open {
  transform: rotate(180deg);
}

.select__trigger:focus .select__arrow {
  color: #3b82f6;
}

.select__trigger--disabled .select__arrow {
  color: #9ca3af;
}

.select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.select__option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.select__option:hover,
.select__option--focused {
  background-color: #f3f4f6;
}

.select__option--selected {
  background-color: #3b82f6;
  color: #ffffff;
}

.select__option--selected:hover,
.select__option--selected.select__option--focused {
  background-color: #2563eb;
}

.select__help {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.select__trigger:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.select__dropdown::-webkit-scrollbar {
  width: 6px;
}

.select__dropdown::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.select__dropdown::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.select__dropdown::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (prefers-reduced-motion: reduce) {
  .select__trigger,
  .select__arrow,
  .select__option,
  .select__clear {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .select__label {
    color: #f3f4f6;
  }

  .select__trigger {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .select__trigger:focus,
  .select__trigger--open {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }

  .select__trigger--disabled {
    background-color: #374151;
    color: #6b7280;
  }

  .select__value--placeholder {
    color: #9ca3af;
  }

  .select__arrow {
    color: #9ca3af;
  }

  .select__trigger:focus .select__arrow {
    color: #60a5fa;
  }

  .select__clear {
    color: #9ca3af;
  }

  .select__clear:hover {
    color: #f3f4f6;
    background-color: #374151;
  }

  .select__dropdown {
    background-color: #1f2937;
    border-color: #4b5563;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }

  .select__option {
    color: #f3f4f6;
  }

  .select__option:hover,
  .select__option--focused {
    background-color: #374151;
  }

  .select__option--selected {
    background-color: #60a5fa;
    color: #1f2937;
  }

  .select__option--selected:hover,
  .select__option--selected.select__option--focused {
    background-color: #3b82f6;
  }

  .select__help {
    color: #9ca3af;
  }

  .select__dropdown::-webkit-scrollbar-track {
    background: #374151;
  }

  .select__dropdown::-webkit-scrollbar-thumb {
    background: #6b7280;
  }

  .select__dropdown::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
}
</style>
