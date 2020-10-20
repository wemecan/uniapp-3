// const domain = 'http://192.168.101.248:9090'
const domain = 'http://124.193.69.147:24890/'

const request = {
	get: function(url, params = {}, cb) {
		return uni.request({
			url: domain + url,
			method: 'get',
			data: params,
			success: res => {
				cb(res)
			},
			fail: err => {
				console.log(err)
			}
		})
	},
	post: function(url, params = {}, cb) {
		return new Promise((resolve, reject) => {
			// 获取Token
			let Authorization = uni.getStorageSync('TokenKey')
			let module = uni.getStorageSync('auditModule')
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			uni.request({
				url: domain + url,
				method: 'post',
				data: params,
				header: {
					module,
					"Content-type": "application/json; charset=UTF-8",
					...!!Authorization && { Authorization: 'bearer ' + Authorization }
				},
				success: res => {
					uni.hideLoading()
					if (res.statusCode === 200) {
						cb && cb(res.data)
						resolve(res.data)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 2000
						})
					}
				},
				fail: err => {
					uni.hideLoading()
					uni.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 2000,
						success() {
							reject(err)
						}
					})
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		})
	}
}

export default request
