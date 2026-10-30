import { createApp } from 'vue';
import 'palo-ui-system/css';
import './estilos.css';
import App from './App.vue';
import { router } from './router.js';

createApp(App).use(router).mount('#app');
