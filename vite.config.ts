import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      reactRefresh(),
      checker({
        overlay: false,
        typescript: true,
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
    },
    publicDir: 'public',
  };
});
