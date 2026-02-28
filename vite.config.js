import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // BYPASS FIREWALL: Route all /supabase requests through Node.js (Vite Dev Server)
        '/supabase': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          secure: false, // In case of local ssl issues
          rewrite: (path) => path.replace(/^\/supabase/, '')
        }
      }
    }
  }
})
