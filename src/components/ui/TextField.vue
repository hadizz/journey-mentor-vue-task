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

const inputClasses = computed(() => [
  'text-field__input',
  `text-field__input--${props.size}`,
  {
    'text-field__input--error': hasError.value,
    'text-field__input--disabled': props.disabled,
    'text-field__input--readonly': props.readonly,
  },
])

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

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur,
  inputRef,
})
</script>

<template>
  <div class="text-field">
    <label
      v-if="label"
      :for="inputId"
      class="text-field__label"
      :class="{ 'text-field__label--required': required }"
    >
      {{ label }}
      <span v-if="required" class="text-field__required" aria-label="required">*</span>
    </label>

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

    <div v-if="helpText && !error" :id="`${inputId}-help`" class="text-field__help">
      {{ helpText }}
    </div>

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
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-field__label--required {
  color: var(--color-text);
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
  border: none;
  border-radius: 6px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-weight: 300;
  line-height: 1.5;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 2px 8px var(--color-shadow);
}

/* -------------------------------------------------- SIZES -------------------------------------------------- */
.text-field__input--small {
  padding: 8px 12px;
}

.text-field__input--medium {
  padding: 12px 16px;
}

.text-field__input--large {
  padding: 16px 20px;
}

/* -------------------------------------------------- STATES -------------------------------------------------- */
.text-field__input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.text-field__input:hover:not(:disabled):not(:readonly) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.text-field__input--error {
  border: 2px solid #ef4444;
  background-color: var(--color-background-soft);
}

.text-field__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.text-field__input--disabled {
  background-color: var(--color-background-mute);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.text-field__input--readonly {
  background-color: var(--color-background-mute);
  cursor: default;
}

.text-field__input::placeholder {
  color: var(--color-input);
  font-weight: 300;
}

.text-field__help {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
  font-weight: 300;
}

.text-field__error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 300;
}

.text-field__input:focus-visible {
  outline: 2px solid var(--color-border-hover);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .text-field__input {
    transition: none;
  }
}
</style>
