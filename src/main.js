// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Components
import './components'

// Plugins
import './plugins'

// Sync router with store
import {
  sync
} from 'vuex-router-sync'

// Application imports
import App from './App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbvue/build/css/mdb.css'
import 'vue-material-design-icons/styles.css'
import VueMathjax from 'vue-mathjax'
import './registerServiceWorker'
// Sync store with router
sync(store, router)

Vue.use(VueMathjax)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
  // eslint-disable-next-line eol-last
}).$mount('#app')