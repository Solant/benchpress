<script setup lang="ts">
import { ref } from 'vue';

import {
  BaseButton, BaseDropdownButton, BaseInput, BaseMenuItem,
} from '@/shared/ui';

import { examples } from '../config';

defineProps<{
  hasTasks: boolean;
  hasImports: boolean;
}>();

const emit = defineEmits<{
  run: [];
  addTask: [];
  loadExample: [payload: keyof typeof examples];
  share: [];
  openCe: [];
}>();

const time = defineModel<number>('time');
const iterations = defineModel<number>('iterations');
const warmup = defineModel<boolean>('warmup');
const warmupTime = defineModel<number>('warmupTime');
const warmupIterations = defineModel<number>('warmupIterations');
const setup = defineModel<boolean>('setup');

const shareText = ref('Share');
function share() {
  emit('share');
  shareText.value = 'Shared';

  setTimeout(() => {
    shareText.value = 'Share';
  }, 800);
}

const examplesKeys = Object.keys(examples);
</script>

<template>
  <header
    class="flex items-center gap-4 px-2 py-1.5 md:px-4 md:py-2
      bg-surface-0 border-b border-border flex-wrap"
  >
    <div class="flex gap-2 items-center flex-wrap">
      <BaseButton
        variant="secondary"
        icon="i-mdi-plus"
        @click="$emit('addTask')"
      >
        Add Task
      </BaseButton>

      <BaseDropdownButton>
        Load Example

        <template #content>
          <BaseMenuItem
            v-for="item in examplesKeys"
            :key="item"
            @click="emit('loadExample', item)"
          >
            {{ item }}
          </BaseMenuItem>
        </template>
      </BaseDropdownButton>

      <BaseButton
        variant="primary"
        icon="i-mdi-play"
        :disabled="!hasTasks"
        @click="$emit('run')"
      >
        Run Benchmarks
      </BaseButton>
      <BaseButton
        variant="secondary"
        :icon="shareText === 'Share' ? 'i-mdi-share' : 'i-mdi-check'"
        @click="share"
      >
        {{ shareText }}
      </BaseButton>
      <BaseButton
        variant="secondary"
        icon="i-mdi-open-in-new"
        @click="$emit('openCe')"
      >
        Compare in Compiler Explorer
      </BaseButton>

      <div
        v-if="hasImports"
        title="Imports are not supported in Compiler Explorer"
        class="i-mdi-warning c-warning"
      />
    </div>

    <div class="flex gap-2 md:gap-3 items-center md:ml-auto flex-wrap">
      <label class="flex items-center gap-1 text-xs c-text-secondary">
        <input
          v-model="setup"
          type="checkbox"
          class="accent-accent"
        >
        <span>Setup</span>
      </label>
      <label class="flex items-center gap-1 text-xs c-text-secondary">
        <span>Time (ms)</span>
        <BaseInput
          v-model.number="time"
          class="w-[70px]"
          type="number"
          min="100"
          step="50"
        />
      </label>
      <label class="flex items-center gap-1 text-xs c-text-secondary">
        <span>Iterations</span>
        <BaseInput
          v-model.number="iterations"
          type="number"
          min="1"
          class="w-[70px]"
        />
      </label>
      <label class="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap">
        <input
          v-model="warmup"
          type="checkbox"
          class="accent-accent"
        >
        <span>Warmup</span>
      </label>
      <label
        v-if="warmup"
        class="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap"
      >
        <span>Warmup (ms)</span>
        <BaseInput
          v-model.number="warmupTime"
          type="number"
          min="0"
          step="50"
          class="w-[70px]"
        />
      </label>
      <label
        v-if="warmup"
        class="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap"
      >
        <span>Warmup Iterations</span>
        <BaseInput
          v-model.number="warmupIterations"
          type="number"
          min="1"
          class="w-[70px]"
        />
      </label>
    </div>
  </header>
</template>
