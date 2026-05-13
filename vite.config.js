import { defineConfig } from 'vite'

export default defineConfig({
  // Ensure the base path is correct for Cloudflare Pages
  base: '/',
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    cssMinify: true, // Explicitly enable CSS minification
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunking
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // More aggressive console removal
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        toplevel: true, // Mangle top-level names
      },
      format: {
        comments: false,
        beautify: false,
      },
    },
  },
})