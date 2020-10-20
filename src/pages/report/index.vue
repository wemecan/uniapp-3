<template>
	<view>
		<qm-navbar title="报表" :isShowBack="false"></qm-navbar>
		<view class="report_list">
			<view class="report_list-ul" v-for="(item,i) in reportList" :key="i">
				<view class="report_list-item" @click="showIframe(item)">
					<view class="item-img">
						<image :src="item.url" mode=""></image>
					</view>
					<view class="item-content">
						<view class="item-content-title">
							{{item.lable}}
						</view>
						<view class="item-content-rightText">
							{{item.number}}
						</view>
						<view class="item-arrow">
							<uni-icons type="arrowright" color="#999"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<qm-tabs name="报表"></qm-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				reportList: []
			}
		},
		onShow() {
			this.reportList = [{
					id: 1,
					url: '/static/img/report/analysis.png',
					lable: '销售利润分析',
					number: '￥562400',
				},
				{
					id: 2,
					url: '/static/img/report/analysis.png',
					lable: '客户额度分析',
					number: '￥562400',
				},
				{
					id: 3,
					url: '/static/img/report/statistics.png',
					lable: '合同执行统计',
					number: '￥562400',
				},
				{
					id: 4,
					url: '/static/img/report/percentage.png',
					lable: '库存资金占比',
					number: '￥562400',
				},
				{
					id: 5,
					url: '/static/img/report/p_statistics.png',
					lable: '风险占比变化统计',
					number: '￥562400',
				},
				
			]
		},
		methods: {
			showIframe(e) {
				this.$Router.push({
					path: '/pages/report-iframe/report-iframe',
					query: {
						id: e.id
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.report_list {
		height: calc(100vh - 190upx);
		background: #f5f5f5;

		.report_list-ul {
			background-color: #fff;

			.report_list-item {
				height: 100upx;
				line-height: 100upx;
				display: flex;
				padding-left: 30upx;

				.item-img {
					width: 80upx;
					height: 80upx;
					line-height: 140upx;
					text-align: center;
					margin: 12upx 20upx 0 0;

					image {
						display: block;
						width: 76upx;
						height: 76upx;
					}
				}

				.item-content {
					flex: 1;
					display: flex;
					font-size: 28upx;
					border-bottom: 2upx solid #f5f5f5;
					padding-right: 30upx;

					.item-content-title {
						flex: 2;
						color: #333;
					}

					.item-content-rightText {
						font-size: 24upx;
						flex: 1;
						text-align: right;
						color: #999;
					}
				}
			}

		}
	}
</style>
