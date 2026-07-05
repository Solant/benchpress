<script lang="ts" setup>
withDefaults(defineProps<{ type?: 'text' | 'number' }>(), {
  type: 'text',
});

const model = defineModel<number | string>({ required: false });
</script>

<template>
  <input
    v-model="model"
    :type="type"
    class=":uno:
      bg-bg border border-border c-text-primary rounded
      px-2 py-1 focus:outline-none focus:border-accent
      text-xs px-1.5 py-0.5"
  >
</template>
