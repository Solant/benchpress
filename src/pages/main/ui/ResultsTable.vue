<script setup lang="ts">
import type { TaskResult } from '../../../shared/lib/benchmark';
import { formatMs, formatOps, formatPercentage } from './formatters';

defineProps<{
  results: TaskResult[];
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table
      v-if="results.length > 0"
      class="w-full border-collapse text-xs font-mono"
    >
      <thead>
        <tr>
          <th
            class="text-left px-2.5 py-1.5
            bg-surface-0 text-text-muted font-semibold
            border-b border-border whitespace-nowrap"
          >
            Task
          </th>
          <th
            class="text-left px-2.5 py-1.5
            bg-surface-0 text-text-muted font-semibold
            border-b border-border whitespace-nowrap"
          >
            Status
          </th>
          <th
            class="text-left px-2.5 py-1.5
            bg-surface-0 text-text-muted font-semibold
            border-b border-border whitespace-nowrap"
          >
            Latency avg (ns)
          </th>
          <th
            class="text-left px-2.5 py-1.5
            bg-surface-0 text-text-muted font-semibold
            border-b border-border whitespace-nowrap"
          >
            Throughput avg (ops/s)
          </th>
          <th
            class="text-left px-2.5 py-1.5
            bg-surface-0 text-text-muted font-semibold
            border-b border-border whitespace-nowrap"
          >
            Throughput med (ops/s)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in results"
          :key="r.title"
          :class="r.state === 'errored' ? 'text-danger' : ''"
        >
          <td
            class="px-2.5 py-[5px] border-b border-border
            text-text-secondary whitespace-nowrap
            text-text-primary font-semibold"
          >
            {{ r.title }}
          </td>
          <td
            class="px-2.5 py-[5px] border-b border-border
            text-text-secondary whitespace-nowrap"
          >
            <span
              class=":uno: px-1.5 py-0.5 rounded text-[11px] uppercase"
              :class="{
                'bg-success-bg text-success': r.state === 'completed',
                'bg-danger-bg text-danger': r.state === 'errored',
                'bg-warning-bg text-warning': r.state === 'aborted',
              }"
            >{{ r.state }}</span>
          </td>
          <td
            class=":uno:
            px-2.5 py-[5px] border-b border-border
            text-text-secondary whitespace-nowrap"
          >
            <template v-if="r.state !== 'errored'">
              {{ formatMs(r.latency?.mean[0]) }} ±
              {{ formatPercentage(r.latency?.mean[1]) }}
            </template>
          </td>
          <td
            class=":uno:
            px-2.5 py-[5px] border-b border-border
            text-text-secondary whitespace-nowrap"
          >
            <template v-if="r.state !== 'errored'">
              {{ formatOps(r.throughput.mean[0]) }} ±
              {{ formatPercentage(r.throughput.mean[1]) }}
            </template>
          </td>
          <td
            class=":uno:
            px-2.5 py-[5px] border-b border-border
            text-text-secondary whitespace-nowrap"
          >
            <template v-if="r.state !== 'errored'">
              {{ formatOps(r.throughput?.med[0]) }} ±
              {{ formatOps(r.throughput?.med[1]) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-else
      class=":uno: p-6 text-center text-text-muted text-xs"
    >
      Run benchmarks to see results
    </div>
  </div>
</template>
