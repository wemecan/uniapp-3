<template>
	<view>
		<qm-navbar title="报表详情" url="/pages/report/index"></qm-navbar>
		<view class="iframe">
			<iframe :src="srcName"></iframe>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iframeId: '',
				srcName: '',
				srcList: [{
						id: 1,
						src: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E8%25BF%259B%25E5%258F%25A3%25E6%25A3%2589%25E6%25B1%2587%25E6%2580%25BB%25E8%25A1%25A8.cpt&op=view&token=3bfe37fbc896ddf2c308a8a790d9feec&tenantCode=8a4577dbd919675758d57999a1e891fe',
					},
					{
						id: 2,
						src: 'http://124.193.69.147:10202/report/decision/view/report?viewlet=tingjun%2Frm%2FstrategyProfit_phone.cpt&token=0a9c21acb3dbd4a6b73221f7a294d86c&tenantCode=bbd226a62c5694b7d5c8a25a9c2c9972',
					},
					{
						id: 3,
						src: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E8%25BF%259B%25E5%258F%25A3%25E6%25A3%2589%25E6%25B1%2587%25E6%2580%25BB%25E8%25A1%25A8.cpt&op=view&token=3bfe37fbc896ddf2c308a8a790d9feec&tenantCode=8a4577dbd919675758d57999a1e891fe',
					},
					{
						id: 4,
						src: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E8%25BF%259B%25E5%258F%25A3%25E6%25A3%2589%25E6%25B1%2587%25E6%2580%25BB%25E8%25A1%25A8.cpt&op=view&token=3bfe37fbc896ddf2c308a8a790d9feec&tenantCode=8a4577dbd919675758d57999a1e891fe',
					},
					{
						id: 5,
						src: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E8%25BF%259B%25E5%258F%25A3%25E6%25A3%2589%25E6%25B1%2587%25E6%2580%25BB%25E8%25A1%25A8.cpt&op=view&token=3bfe37fbc896ddf2c308a8a790d9feec&tenantCode=8a4577dbd919675758d57999a1e891fe',
					},
				]
			}
		},
		onLoad() {
			this.iframeId = this.$Route.query.id
		},
		onShow() {
			this.srcList.forEach((element) => {
				if (Number(element.id) === Number(this.iframeId)) this.srcName = element.src
			})
		}
	}
</script>

<style scoped lang="scss">
	.iframe {
		width: 100%;
		height: calc(100vh - 88upx);
		background-color: #f5f5f5;
		overflow: auto;

		iframe {
			display: block;
			width: 100%;
			height: 100%;
			border: none;
		}
	}
</style>
