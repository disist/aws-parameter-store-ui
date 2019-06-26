import Vue from 'vue';
import App from './App.vue';
import Table from 'buefy/dist/components/table';
import Input from 'buefy/dist/components/input';
import Button from 'buefy/dist/components/button';
import Field from 'buefy/dist/components/field';
import Select from 'buefy/dist/components/select';
import Loading from 'buefy/dist/components/loading';
import Modal from 'buefy/dist/components/modal';
import Toast from 'buefy/dist/components/toast';
import 'buefy/dist/buefy.css';

Vue.config.productionTip = false;

Vue.use(Table);
Vue.use(Input);
Vue.use(Button);
Vue.use(Field);
Vue.use(Select);
Vue.use(Loading);
Vue.use(Modal);
Vue.use(Toast);

new Vue({
  render: h => h(App),
}).$mount('#app')
