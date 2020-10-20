<template>
	<view>
		<qm-navbar title="附件预览" :event="goBack"></qm-navbar>
		<web-view class="pdf-viewer" :src="`/static/hybrid/html/web/viewer.html?file=${file}`"></web-view>
	</view>
</template>

<script>
	const domain = 'http://192.168.101.248:9090/preview/'
	let wv // 计划创建的webview
	export default {
		data() {
			return {
				file: ''
			}
		},
		onLoad() {
			this.file = domain + this.$Route.query.url
		},
		onReady() {
			// #ifdef APP-PLUS
			const currentWebview = this.$scope.$getAppWebview()
			setTimeout(() => {
				wv = currentWebview.children()[0]
				wv.setStyle({
					top: 42,
					bottom: 0
				})
			}, 1000)
			// #endif
		},
		methods: {
			goBack() {
				this.$Router.back()
			}
		}
	}
</script>

<style>
	.pdf-viewer {
		top: 88upx;
	}
</style>
