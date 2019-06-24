import Vue from 'vue';
import App from './App.vue';
import Table from 'buefy/dist/components/table';
import Input from 'buefy/dist/components/input';
import Button from 'buefy/dist/components/button';
import Field from 'buefy/dist/components/field';
import 'buefy/dist/buefy.css';

Vue.config.productionTip = false;

Vue.use(Table);
Vue.use(Input);
Vue.use(Button);
Vue.use(Field);

new Vue({
  render: h => h(App),
}).$mount('#app')
