import App from '@/App.vue';
import '@/assets/tailwind.css';
import router from '@/router';
import store from '@/store';
import { createApp } from 'vue';

createApp(App).use(store).use(router).mount('#app');
