<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  icon?: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    type="button"
    :disabled
    class=":uno:
    inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold
    cursor-pointer whitespace-nowrap
    transition-colors duration-150
    w-full
    hover:(bg-surface-0)
    bg-surface-1 c-text-secondary
    "
    @click="$emit('click')"
  >
    <i
      v-if="icon"
      :class="icon"
    />
    <slot />
  </button>
</template>
