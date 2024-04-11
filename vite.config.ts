import MillionLint from '@million/lint';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
var plugins = [react()];
plugins.unshift(MillionLint.vite())
export default defineConfig({
  plugins: plugins
});