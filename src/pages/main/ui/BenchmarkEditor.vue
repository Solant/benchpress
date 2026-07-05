<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';

import { BaseInput } from '@/shared/ui';

import type { Extension } from '../config/editorExtensions';

defineProps<{
  closable?: boolean;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const Codemirror = defineAsyncComponent(async () => {
  const module = await import('vue-codemirror');
  return module.Codemirror;
});

const title = defineModel<string>('title');
const code = defineModel<string>('code');

const extensions = shallowRef<Extension[]>([]);
import('../config/editorExtensions').then((mod) => { extensions.value = mod.default; });
</script>

<template>
  <div class="flex flex-col bg-surface-1 overflow-hidden shrink-0">
    <div class="flex items-center gap-1.5 px-2 py-1.5 bg-surface-0 border-b border-border">
      <BaseInput
        v-model="title"
        class="mr-auto bg-transparent border-transparent font-semibold"
        placeholder="Task name"
      />
      <button
        v-if="closable"
        type="button"
        class="bg-transparent border-none cursor-pointer rounded hover:(bg-danger c-white) c-danger"
        title="Remove task"
        @click="emit('remove')"
      >
        <i class="block i-mdi-close" />
      </button>
    </div>
    <div class="flex-1 min-h-[150px] md:min-h-[200px] overflow-hidden">
      <Codemirror
        v-model="code"
        :extensions="extensions"
        indent-with-tab
        :tab-size="2"
        :placeholder="placeholder ?? '// Write your benchmark code here...'"
      />
    </div>
  </div>

  <div
    v-if="error"
    class="flex items-baseline gap-2 px-2.5 py-1.5 bg-danger-bg border border-danger font-mono"
  >
    <span
      class="text-xs font-bold uppercase tracking-wider c-danger"
    >
      Error
    </span>
    <span
      class="text-xs c-danger"
    >
      {{ error }}
    </span>
  </div>
</template>
