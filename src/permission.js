import router from './router'
import store from './store'
const Base64 = require('js-base64').Base64

const isExpired = () => {
	const token = uni.getStorageSync('TokenKey')
	const str = token.split('.')[1]
	const user = str && JSON.parse(Base64.decode(str))
	if (user && user.exp) {
		const date = new Date(0)
		date.setUTCSeconds(user.exp)
	
		if (date > new Date()) {
			return false
		} else {
			return true
		}
	}
	return true
}

// 非H5端关闭后台则清空数据，H5端在token过期前只能退出登录才能回到登录界面
// #ifndef H5
uni.clearStorageSync()
// #endif
router.beforeEach(async (to, from, next) => {
	const token = uni.getStorageSync('TokenKey')
	uni.showLoading({
	    title: '加载中'  
	})
	if (token) {
		if (isExpired()) {
			uni.showToast({
				title: '验证过期',
				icon: 'none',
				duration: 2000
			})
			uni.clearStorageSync()
			next('/pages/login/index')
		} else {
			if (to.path === '/pages/login/index') {
				// 登录状态前往登录页则默认跳转首页
				next('/pages/work/index')
			} else {
				if (JSON.stringify(store.state.dictData) === "{}") {
					await store.dispatch('initData')
				}
				next()
			}
		}
	} else {
		if (to.path !== '/pages/login/index') {
			next('/pages/login/index')
		} else {
			next()
		}
	}
})

// 全局路由后置守卫
router.afterEach((to, from) => {
	uni.hideLoading()
})
