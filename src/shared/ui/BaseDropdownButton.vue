<script lang="ts" setup>
import { ref } from 'vue';

import BaseButton from './BaseButton.vue';

const open = ref(false);
</script>

<template>
  <div class=":uno: inline-block relative">
    <BaseButton
      variant="secondary"
      @click="open = !open"
    >
      <slot />

      <span
        class="i-mdi-chevron-down"
        :class="{ 'rotate-180': open }"
      />
    </BaseButton>

    <div
      v-if="open"
      class=":uno: absolute left-0 bg-surface-1 min-w-full text-xs border border-border z-1"
      @click="open = false"
    >
      <slot name="content" />
    </div>
  </div>
</template>
