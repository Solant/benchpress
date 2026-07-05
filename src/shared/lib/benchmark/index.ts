interface Task {
  title: string;
  code: string;
}

export interface TaskResult {
  error?: string;
  title: string;
  state: string;
  latency: {
    mean: [number, number];
    med: [number, number];
  };
  throughput: {
    mean: [number, number];
    med: [number, number];
  };
  samples: number;
}

type ImportMap = Array<{ specifier: string; url: string }>;

function prepareImportMap(importMap: ImportMap): string {
  const result = {
    imports: {} as Record<string, string>,
    scopes: {},
  };

  for (const { specifier, url } of importMap) {
    result.imports[specifier] = url;
  }

  return JSON.stringify(result, null, 2);
}

function prepareBenchmarkTasks(task: Task): string {
  return `\
.add('${task.title}', () => {
  ${task.code}
})`;
}

export function runBenchmark(
  payload: {
    importMap?: ImportMap;
    tasks: Task[];
    setup?: string;
    config: {
      time: number;
      iterations: number;
      warmup: boolean;
      warmupTime: number;
      warmupIterations: number;
    };
  },
): Promise<TaskResult[]> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'rgba(0, 0, 0, 0.5)';
    document.body.appendChild(iframe);

    const { contentDocument, contentWindow } = iframe;
    if (contentDocument == null || contentWindow == null) {
      throw new Error('iframe contentDocument or contentWindow is null');
    }

    contentWindow.addEventListener('message', (event) => {
      if (event.data.type === 'success') {
        resolve(event.data.results);
      } else if (event.data.type === 'error') {
        reject(new Error(event.data.message));
      }
      iframe.remove();
    });

    contentWindow.addEventListener('error', (event) => {
      // eslint-disable-next-line no-alert
      alert(`${event.error.name}: ${event.error.message}`);
      iframe.remove();
    });

    const h1 = contentDocument.createElement('h1');
    h1.style.color = '#e6edf3';
    h1.style.width = '100%';
    h1.style.textAlign = 'center';
    h1.textContent = 'Benchmark running';
    contentDocument.body.appendChild(h1);

    const h2 = contentDocument.createElement('h2');
    h2.style.color = '#b1bac4';
    h2.style.width = '100%';
    h2.style.textAlign = 'center';
    h2.style.fontStyle = 'italic';
    h2.textContent = 'Heavy tab or system activity can skew results.';
    contentDocument.body.appendChild(h2);

    const importmap = contentDocument.createElement('script');
    importmap.type = 'importmap';
    importmap.innerHTML = prepareImportMap([{ specifier: 'tinybench', url: 'https://unpkg.com/tinybench@6.0.2/dist/index.js' }, ...(payload?.importMap ?? [])]);
    contentDocument.head.appendChild(importmap);

    const benchmark = contentDocument.createElement('script');
    benchmark.type = 'module';
    benchmark.innerHTML = `
      import { Bench } from 'tinybench'

      ${payload?.setup ?? ''}

      try {
        const bench = new Bench(${JSON.stringify(payload.config)})
        bench
        ${payload?.tasks.map(prepareBenchmarkTasks).join('\n')}
        await bench.run()
        const results = [];
        for (const b of bench.tasks) {
          let error = undefined;
          if (b.result.error) {
            error = b.result.error.name + ": " + b.result.error.message;
          }
          results.push({
            error,
            title: b.name,
            state: b.result.state,
            latency: {
              mean: [b.result.latency?.mean, b.result.latency?.rme],
              med: [b.result.latency?.p50, b.result.latency?.mad],
            },
            throughput: {
              mean: [b.result.throughput?.mean, b.result.throughput?.rme],
              med: [b.result.throughput?.p50, b.result.throughput?.mad],
            },
            samples: b.result.samples,
          });
        }
        window.postMessage({ type: 'success', results })
      } catch (e) {
        window.postMessage({ type: 'error', message: e instanceof Error ? e.message : String(e) })
      }

    `;
    contentDocument.body.appendChild(benchmark);
  });
}
