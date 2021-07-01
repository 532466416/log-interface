import Vue from 'vue'
import App from './App.vue'
import ElementUi from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

import './assets/icons/iconfont.css'

Vue.use(ElementUi)
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')