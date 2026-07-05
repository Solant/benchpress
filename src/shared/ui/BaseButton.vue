<script setup lang="ts">
type Variant = 'primary' | 'secondary';

defineProps<{
  disabled?: boolean;
  variant: Variant;
  icon?: string;
}>();

defineEmits<{
  click: [];
}>();

const classes: Record<Variant, string> = {
  secondary: ':uno: bg-surface-1 c-text-secondary hover:not-disabled:(bg-surface-1 border-text-muted c-text-primary)',
  primary: ':uno: bg-accent c-[#0d1117] border-accent hover:not-disabled:(bg-accent-hover border-accent-hover)',
};
</script>

<template>
  <button
    type="button"
    :disabled
    class=":uno:
    inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold
    border border-border rounded cursor-pointer whitespace-nowrap
    transition-colors duration-150
    disabled:opacity-50 disabled:cursor-not-allowed"
    :class="classes[variant]"
    @click="$emit('click')"
  >
    <i
      v-if="icon"
      :class="icon"
    />
    <slot />
  </button>
</template>
