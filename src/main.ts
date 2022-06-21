import { createApp } from 'vue';
import App from './App.vue';

// Router
import { Router } from '/@/router';

// WindiCSS
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import { store } from './composables/useUtils';

const app = createApp(App);
app.provide ( 'useStore' , store );

app.use(Router);
app.mount('#app');
