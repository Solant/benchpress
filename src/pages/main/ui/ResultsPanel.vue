<script setup lang="ts">
import ResultsTable from './ResultsTable.vue';
import ResultsChart from './ResultsChart.vue';
import type { TaskResult } from '@/shared/lib/benchmark';

defineProps<{
  results: TaskResult[];
}>();
</script>

<template>
  <aside class="bg-surface-1 border-t md:border-l border-border overflow-hidden">
    <div class="px-3 py-2 bg-surface-0 border-b border-border">
      <h2 class="m-0 text-sm font-semibold text-text-primary">
        Results
      </h2>
    </div>
    <div class="overflow-y-auto p-3">
      <ResultsTable :results="results" />
      <div class="h-px bg-border my-4" />
      <ResultsChart :results="results" />
    </div>
  </aside>
</template>
