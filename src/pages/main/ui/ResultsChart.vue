<script setup lang="ts">
import { computed } from 'vue';
import type { TaskResult } from '@/shared/lib/benchmark';
import { formatOps } from './formatters';

const props = defineProps<{
  results: TaskResult[];
}>();

interface BarData {
  name: string;
  value: number;
  pct: number; // percentage of max
  formatted: string;
}

const bars = computed<BarData[]>(() => {
  const completed = props.results.filter(
    (r) => (r.state === 'completed' || r.state === 'aborted-with-statistics') && r.latency,
  );
  if (completed.length === 0) return [];

  const maxMean = Math.max(...completed.map((r) => r.throughput.med[0]));

  return completed.map((r) => {
    const meanOps = r.throughput.med[0];
    const formatted = formatOps(meanOps);
    return {
      name: r.title,
      value: meanOps,
      pct: maxMean > 0 ? (meanOps / maxMean) * 100 : 0,
      formatted,
    };
  });
});
</script>

<template>
  <div>
    <h3 class="m-0 mb-2.5 text-xs font-semibold text-text-secondary">
      Throughput med (ops/s)
    </h3>
    <div
      v-if="bars.length > 0"
      class="grid grid-cols-[80px_1fr_60px] md:grid-cols-[120px_1fr_80px] gap-2"
    >
      <template
        v-for="bar in bars"
        :key="bar.name"
      >
        <span
          class="text-xs c-text-secondary overflow-hidden text-ellipsis whitespace-nowrap font-mono"
        >
          {{ bar.name }}
        </span>
        <div class="h-4 bg-surface-0 rounded overflow-hidden">
          <div
            class="h-full bg-accent rounded"
            :style="{ width: bar.pct + '%' }"
          />
        </div>
        <span
          class="text-xs font-mono text-text-muted text-right"
        >
          {{ bar.formatted }}
        </span>
      </template>
    </div>
    <div
      v-else
      class="p-4 text-center text-text-muted text-xs"
    >
      No completed benchmarks to visualize
    </div>
  </div>
</template>
