import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    host: true, // escuta em 0.0.0.0
    port: 4200,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'f99f5efdcb68.ngrok-free.app' // adicione seu domínio ngrok aqui
    ]
  }
});
