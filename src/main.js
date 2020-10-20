import Vue from 'vue'
import store from './store'
import {
	RouterMount
} from './router/hhyang-uni-simple-router/index.js';
import App from './App'
import './permission'
import '@/filters/index'
Vue.config.productionTip = false

Vue.prototype.$store = store
App.mpType = 'app'

Vue.filter('dataDictFormat', function(value, args) {
	if (value && args && store.state.dictData[args]) {
		if (value instanceof Array) {
			return value.map(val => {
				return store.state.dictData[args].filter((v) => v.value === val)[0].label
			})
		} else if (store.state.dictData[args].filter((v) => v.value === value)[0]) {
			return store.state.dictData[args].filter((v) => v.value === value)[0].label
		} else {
			return
		}
	}
	return value
})
Vue.filter('dateFormate', function(value) {
	if (value) {
		if (value.length === 8) {
			return value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8)
		} else {
			return value.slice(0, 10)
		}
	}
	return null;
})

const app = new Vue({
	store,
	...App
})
// app.$mount()

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
