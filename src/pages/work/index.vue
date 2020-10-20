<template>
	<view class="page-body">
		<view class="header">
			<img src="static/img/worker/banner.png" alt="">
			<div class="title">大宗商品交易和风险管理系统 V5.0</div>
		</view>
		<view class="content">
			<view class="item" v-for="item in list" :key="item.title" :style="{ opacity: item.disabled ? '0.5' : '1' }">
				<img :src="item.imgSrc" @click="doItem(item.routePath)">
				<uni-text class="label">{{ item.title }}</uni-text>
			</view>
		</view>

		<qm-tabs name="工作台"></qm-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						imgSrc: 'static/img/worker/todo.png',
						title: '待办',
						routePath: '/pages/handle/index',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/complete.png',
						title: '已办',
						routePath: '/pages/complete/index',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/invoice.png',
						title: '我的单据',
						routePath: '/pages/document/document',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/price.png',
						title: '定价登记',
						routePath: '/pages/price-registration/price-registration',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/price.png',
						title: '定价确认',
						routePath: '/pages/price-confirm/price-confirm',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/notice.png',
						title: '提单登记',
						routePath: '/pages/ladingBill/ladingBill',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/inOrder.png',
						title: '入库通知',
						routePath: '/pages/storage-notice/storage-notice',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/outOrder.png',
						title: '出库通知',
						count: 0,
						disabled: true,
					},
					{
						imgSrc: 'static/img/worker/payApply.png',
						title: '付款申请',
						routePath: '/pages/fund-apply/fund-apply',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/payApply.png',
						title: '付款确认',
						routePath: '/pages/fund-confirm/fund-confirm',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/receipt.png',
						title: '收款登记',
						count: 0,
						disabled: true,
					},
					{
						imgSrc: 'static/img/worker/approval.png',
						title: '开信用证申请',
						count: 0,
						disabled: true,
					},
					{
						imgSrc: 'static/img/worker/invoice.png',
						title: '开票申请(内)',
						count: 0,
						disabled: true,
					},
					{
						imgSrc: 'static/img/worker/invoice.png',
						title: '收票登记(内)',
						routePath: '/pages/invoice-registration/invoice-registration',
						count: 0,
						disabled: false,
					},
					{
						imgSrc: 'static/img/worker/invoice.png',
						title: '开票登记(外)',
						count: 0,
						disabled: true,
					}
				]
			}
		},
		methods: {
			doItem(url) {
				this.$Router.push(url)
			}
		}
	}
</script>

<style scoped lang='scss'>
	.page-body {
		.header {
			position: relative;
			width: 100%;

			img {
				display: block;
				width: 100%;
			}

			.title {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 80upx;
				line-height: 80upx;
				text-indent: 32upx;
				background: rgba(0, 0, 0, 0.3);
				font-size: 28upx;
				color: #ffffff;
			}
		}

		.content {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: calc(100vh - 574upx);
			overflow-y: auto;
			padding: 40upx 30upx;
			box-sizing: border-box;

			.item {
				width: 25%;
				margin-bottom: 40upx;
				text-align: center;

				img {
					display: block;
					width: 90upx;
					height: 90upx;
					margin: 0 auto 8upx;
				}

				.label {
					display: block;
					color: #666666;
					font-size: 24upx;
				}
			}
		}
	}
</style>
