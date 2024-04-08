import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Vuetify Blueprints
import { md3 } from 'vuetify/blueprints';

// Icons
import '@mdi/font/css/materialdesignicons.css';
import router from './routes';

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,

  icons: {
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App).use(router).use(vuetify).mount('#app');
