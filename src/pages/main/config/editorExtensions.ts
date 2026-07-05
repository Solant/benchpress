import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

export type Extension = typeof oneDark;

const editorExtensions = [javascript(), oneDark];

export default editorExtensions;
