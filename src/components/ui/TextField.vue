<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

export interface TextFieldProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  helpText?: string
  size?: 'small' | 'medium' | 'large'
  id?: string
  maxlength?: number
  minlength?: number
  autocomplete?: string
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  type: 'text',
  size: 'medium',
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
}>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const hasError = computed(() => Boolean(props.error))

// Compute input classes
const inputClasses = computed(() => [
  'text-field__input',
  `text-field__input--${props.size}`,
  {
    'text-field__input--error': hasError.value,
    'text-field__input--disabled': props.disabled,
    'text-field__input--readonly': props.readonly,
  },
])

// Handle input events
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

// Focus method for parent components
const focus = () => {
  inputRef.value?.focus()
}

// Blur method for parent components
const blur = () => {
  inputRef.value?.blur()
}

// Expose methods to parent
defineExpose({
  focus,
  blur,
  inputRef,
})
</script>

<template>
  <div class="text-field">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="text-field__label"
      :class="{ 'text-field__label--required': required }"
    >
      {{ label }}
      <span v-if="required" class="text-field__required" aria-label="required">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="text-field__wrapper">
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :class="inputClasses"
        :aria-invalid="hasError"
        :aria-describedby="error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined"
        v-bind="attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />
    </div>

    <!-- Help text -->
    <div v-if="helpText && !error" :id="`${inputId}-help`" class="text-field__help">
      {{ helpText }}
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      :id="`${inputId}-error`"
      class="text-field__error"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.text-field__label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-field__label--required {
  color: #374151;
}

.text-field__required {
  color: #ef4444;
  font-weight: 600;
}

.text-field__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.text-field__input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  outline: none;
}

/* -------------------------------------------------- SIZES -------------------------------------------------- */
.text-field__input--small {
  padding: 6px 12px;
  font-size: 13px;
}

.text-field__input--medium {
  padding: 8px 12px;
  font-size: 14px;
}

.text-field__input--large {
  padding: 12px 16px;
  font-size: 16px;
}

/* -------------------------------------------------- STATES -------------------------------------------------- */
.text-field__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.text-field__input:hover:not(:disabled):not(:readonly) {
  border-color: #9ca3af;
}

.text-field__input--error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.text-field__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.text-field__input--disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.text-field__input--readonly {
  background-color: #f9fafb;
  cursor: default;
}

.text-field__input::placeholder {
  color: #9ca3af;
}

.text-field__help {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.text-field__error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-field__input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .text-field__input {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .text-field__label {
    color: #f3f4f6;
  }

  .text-field__input {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .text-field__input:focus {
    border-color: #60a5fa;
  }

  .text-field__input--disabled {
    background-color: #374151;
    color: #6b7280;
  }

  .text-field__help {
    color: #9ca3af;
  }
}
</style>
