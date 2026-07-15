<script setup lang="ts">
import {
  computed, ref, shallowRef, watch,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { runBenchmark, type TaskResult } from '@/shared/lib/benchmark';
import { BaseButton } from '@/shared/ui';

import SettingsBar from './SettingsBar.vue';
import BenchmarkEditor from './BenchmarkEditor.vue';
import ResultsPanel from './ResultsPanel.vue';
import type { BenchmarkTask } from '../model';
import { buildGodboltUrl } from '@/shared/lib/godbolt';
import { examples } from '../config';

const time = ref(250); // @default 1000
const iterations = ref(16); // @default 64
const warmup = ref(true); // @default true
const warmupTime = ref(150); // @default 250
const warmupIterations = ref(8); // @default 16

const tasks = ref<BenchmarkTask[]>([]);
function addTask() {
  tasks.value.push({ id: uuidv4(), title: `Task ${tasks.value.length + 1}`, code: '' });
}
function removeTask(id: BenchmarkTask['id']) {
  tasks.value.splice(tasks.value.findIndex((t) => t.id === id), 1);
}

const results = shallowRef<TaskResult[]>([]);

const setup = ref(false);
const setupCode = ref('');
watch(setup, (value) => {
  if (!value) setupCode.value = '';
});

const hasImports = computed(() => {
  if (setupCode.value.includes('import')) return true;
  if (tasks.value.some((task) => task.code.includes('import'))) return true;

  return false;
});

async function handleRun() {
  results.value = await runBenchmark({
    tasks: tasks.value,
    setup: setupCode.value,
    config: {
      time: time.value,
      iterations: iterations.value,
      warmup: warmup.value,
      warmupTime: warmupTime.value,
      warmupIterations: warmupIterations.value,
    },
  });

  for (let i = 0; i < results.value.length; i += 1) {
    tasks.value[i].error = results.value[i].error ?? undefined;
  }
}

function loadExample(payload: string) {
  const example = examples[payload];
  if (!example) return;

  setup.value = example.setup != null;
  setupCode.value = example.setup ?? '';

  tasks.value = example.tasks.map((task) => ({
    id: uuidv4(),
    ...task,
  }));
}

function share() {
  const payload = {
    tasks: tasks.value,
    setup: setup.value,
    setupCode: setupCode.value,
    time: time.value,
    iterations: iterations.value,
    warmup: warmup.value,
    warmupTime: warmupTime.value,
    warmupIterations: warmupIterations.value,
  };

  const hash = encodeURIComponent(btoa(JSON.stringify(payload)));
  window.location.hash = hash;
  navigator.clipboard.writeText(window.location.href);
}

function load() {
  const hash = window.location.hash.substring(1);
  const payload = JSON.parse(atob(decodeURIComponent(hash)));
  tasks.value = payload.tasks;
  setup.value = payload.setup;
  setupCode.value = payload.setupCode;
  time.value = payload.time;
  iterations.value = payload.iterations;
  warmup.value = payload.warmup;
  warmupTime.value = payload.warmupTime;
  warmupIterations.value = payload.warmupIterations;
}

if (window.location.hash) {
  load();
}

function openCe() {
  window.open(buildGodboltUrl(setupCode.value, tasks.value.map((t) => t.code)), '_blank');
}
</script>

<template>
  <div
    class="flex flex-col h-screen overflow-hidden focus:outline-none"
  >
    <SettingsBar
      v-model:time="time"
      v-model:iterations="iterations"
      v-model:warmup="warmup"
      v-model:warmup-time="warmupTime"
      v-model:warmup-iterations="warmupIterations"
      v-model:setup="setup"
      :has-imports
      :has-tasks="tasks.length > 0"
      @run="handleRun"
      @add-task="addTask()"
      @load-example="loadExample"
      @share="share"
      @open-ce="openCe"
    />
    <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
      <div class="flex lg:w-2/3 flex-1 flex-col items-stretch overflow-auto bg-surface-0">
        <BenchmarkEditor
          v-if="setup"
          v-model:code="setupCode"
          title="Setup"
          placeholder="// Add setup code and import statements
// Use service like unpkg to load npm packages"
        />
        <div
          v-if="tasks.length === 0"
          class="
            flex flex-col items-center justify-center gap-2
            w-full h-full text-center c-text-muted bg-surface-0"
        >
          <p class="m-0">
            No tasks yet.
          </p>
          <p class="m-0">
            <BaseButton
              variant="secondary"
              icon="i-mdi-plus"
              @click="addTask"
            >
              Add Task
            </BaseButton>
          </p>
        </div>
        <BenchmarkEditor
          v-for="task in tasks"
          :key="task.id"
          v-model:title="task.title"
          v-model:code="task.code"
          :error="task.error"
          closable
          @remove="removeTask(task.id)"
        />
      </div>
      <ResultsPanel
        class="lg:w-1/3"
        :results="results"
      />
    </div>

    <div
      class="flex items-center justify-between px-4 py-1
        bg-surface-0 border-t border-border text-[11px] text-text-muted"
    >
      <span>Powered by
        <a
          class="c-text-primary"
          href="https://github.com/tinylibs/tinybench"
          rel="noopener noreferrer"
          target="_blank"
        >tinybench
        </a>
      </span>
      <a
        class="flex items-center gap-1 c-text-primary hover:underline"
        href="https://github.com/Solant/benchpress"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="i-mdi-github" />
        Source code
      </a>
    </div>
  </div>
</template>
