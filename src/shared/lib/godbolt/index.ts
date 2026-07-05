export function buildGodboltUrl(setup: string, sources: string[]): string {
  const state = buildClientState(setup, sources);
  const json = JSON.stringify(state);
  const encoded = btoa(json);
  const escaped = encoded.replace(/[\u007F-\uFFFF]/g, (ch) => {
    const hex = ch.charCodeAt(0).toString(16).padStart(4, '0');
    return `\\u${hex}`;
  });
  return `https://godbolt.org/clientstate/${escaped}`;
}

interface ClientStateCompiler {
  id: string;
  options?: string;
  filters?: Record<string, boolean>;
}

interface ClientStateSession {
  id: number;
  language: string;
  source: string;
  compilers: ClientStateCompiler[];
}

interface ClientState {
  sessions: ClientStateSession[];
}

const compiler: ClientStateCompiler = { id: 'v8trunk' };
const language = 'javascript';

function buildSource(setup: string | null, source: string): string {
  let result = '';

  if (setup) {
    result += setup;
  }

  result += `function __BENCHMARK_FUNCTION__() {
  ${source}
}`;
  result += `
// Collect type information on next call of function
%PrepareFunctionForOptimization(__BENCHMARK_FUNCTION__)

// Call function once to fill type information
__BENCHMARK_FUNCTION__();

// Call function again to go from uninitialized -> pre-monomorphic -> monomorphic
__BENCHMARK_FUNCTION__();
%OptimizeFunctionOnNextCall(__BENCHMARK_FUNCTION__);
__BENCHMARK_FUNCTION__();`;

  return result;
}

function buildClientState(setup: string | null, sources: string[]): ClientState {
  const sessions: ClientStateSession[] = sources.map((source, index) => ({
    id: index + 1,
    language,
    source: buildSource(setup, source),
    compilers: [compiler],
  }));

  return {
    sessions,
  };
}
