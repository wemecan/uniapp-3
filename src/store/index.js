import Vue from 'vue'
import Vuex from 'vuex'
import request from "@/utils/request.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		dictData: {}
	},
	mutations: {
		INIT_DATA(state, data) {
			state.dictData = data
		}
	},
	actions: {
		initData({ commit }) {
			// 多语言数据请求
			return new Promise((resolve, reject) => {
				request.post('/vrm/api/sys/dict/json', {
					data: {
						dictType: '',
						lang: 'zh'
					},
					funcModule: 'init',
					funcOperation: 'json'
				}, result => {
					if (result.status) {
						resolve(result.data)
						commit('INIT_DATA', result.data)
					}
				})
			})
		}
	}
})

export default store