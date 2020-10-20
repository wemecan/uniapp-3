<script>
	export default {

		onLaunch() {
			// #ifdef APP-PLUS
			//	代码示例，此两项代码可以放到App.vue
			this.addJYJPushReceiveNotificationListener()
			this.addJYJPushReceiveOpenNotificationListener()
			// this.addJYJPushReceiveBackgroudNotificationListener()
			this.addJYJPushCustomReceiveNotificationListener()

			setTimeout(function() {
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.getLastPushInfo(result => {
					if (result != null) {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: 'last' + JSON.stringify(result)
						// })
					}
				})
			}, 500)
			// plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			// 	uni.showLoading({
			// 		title: '正在更新，请稍后',
			// 		mask: true
			// 	})
			// 	plus.downloader.createDownload(
			// 		'http://192.168.101.248:9090/vrm-vue/__UNI__20C775C.wgt', {
			// 			filename: '_doc/update/' + widgetInfo.name + '/' + new Date().getTime() + '/'
			// 		},
			// 		function(res, code) {
			// 			uni.hideLoading()
			// 			let filePath = res.filename
			// 			plus.runtime.install(
			// 				filePath, {
			// 					force: false
			// 				},
			// 				(res) => {
			// 					uni.showModal({
			// 						title: '提示',
			// 						content: '成功'
			// 					})
			// 					plus.runtime.restart()
			// 				},
			// 				(e) => {
			// 					uni.showModal({
			// 						title: '提示',
			// 						content: e.message
			// 					})
			// 				}
			// 			)
			// 		}
			// 	).start()
			// 	uni.hideLoading()
			// })
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			addJYJPushReceiveOpenNotificationListener() {
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.addJYJPushReceiveOpenNotificationListener(result => {
					uni.showToast({
						icon: 'none',
						title: 'open' + JSON.stringify(result)
					})
					console.log('打开了' + JSON.stringify(result))
				})
			},
			addJYJPushReceiveNotificationListener() {
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.addJYJPushReceiveNotificationListener(result => {
					uni.showToast({
						icon: 'none',
						title: 'rec' + JSON.stringify(result)
					})
					console.log('收到了' + JSON.stringify(result))
				})
			},
			addJYJPushReceiveBackgroudNotificationListener() {
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.addJYJPushReceiveBackgroudNotificationListener(result => {
					uni.showToast({
						icon: 'none',
						title: 'recback' + JSON.stringify(result)
					})
					console.log('后台收到了' + JSON.stringify(result))
				})

			},
			addJYJPushCustomReceiveNotificationListener() {
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.addJYJPushCustomReceiveNotificationListener(result => {
					uni.showToast({
						icon: 'none',
						title: 'ReceiveCustomNotificationListener' + JSON.stringify(result),
					})
				})
			}
		}
	}
</script>

<style>
	@import './static/font/iconfont.css';

	uni-modal .uni-modal__bd {
		text-align: left;
	}

	.uni-input-input {
		font-size: 32upx;
	}
</style>
