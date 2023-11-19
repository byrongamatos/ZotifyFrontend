import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env,
    },
    plugins: [react()],
  });
};
