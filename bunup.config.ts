import { defineConfig } from 'bunup';

export default defineConfig({
	clean: true,
	dts: true,
	entry: 'src/index.ts',
	external: ['vite'],
	format: ['esm', 'cjs'],
	target: 'node',
});
