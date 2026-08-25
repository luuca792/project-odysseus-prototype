import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { softwareFeedbackApiPlugin } from './vite-plugins/softwareFeedbackApi.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), softwareFeedbackApiPlugin()],
})
