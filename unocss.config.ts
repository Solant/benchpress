import { defineConfig, presetWind4 } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  theme: {
    colors: {
      bg: '#0d1117',
      surface: {
        0: '#161b22',
        1: '#1c2129',
      },
      border: '#30363d',
      text: {
        primary: '#e6edf3',
        secondary: '#b1bac4',
        muted: '#6e7681',
      },
      accent: {
        DEFAULT: '#58a6ff',
        hover: '#79b8ff',
      },
      success: {
        DEFAULT: '#3fb950',
        bg: 'rgba(63, 185, 80, 0.15)',
      },
      danger: {
        DEFAULT: '#f85149',
        bg: 'rgba(248, 81, 73, 0.15)',
      },
      warning: {
        DEFAULT: '#d29922',
        bg: 'rgba(210, 153, 34, 0.15)',
      },
    },
  },
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons(),
  ],
  transformers: [transformerVariantGroup(), transformerCompileClass()],
  preflights: [
    {
      getCSS: () => `
/* ── Scrollbar ── */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #0d1117; }
::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #6e7681; }

/* ── CodeMirror overrides ── */
.cm-editor { height: 100% !important; font-size: 13px !important; }
.cm-editor .cm-scroller { overflow: auto; }
.cm-editor.cm-focused { outline: none; }
`,
    },
  ],
});
