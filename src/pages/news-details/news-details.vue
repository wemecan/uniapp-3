<template>
	<view>
		<qm-navbar title="消息详情" url="/pages/news/index"></qm-navbar>
		<view class="news_detailsList">
			<view class="detali-card">
				<view class="card-header">
					<image :src="newsList.img"></image>
					<view class="title">
						{{newsList.msgTitle.indexOf(':')===-1?newsList.msgTitle:newsList.msgTitle.slice(0,newsList.msgTitle.indexOf(':'))}}
					</view>
					<view class="time">
						{{newsList.userSendDt.slice(0, 10)}}
					</view>
				</view>
				<view class="card-content">
					{{ newsList.senderName }}&nbsp;: &nbsp;{{ newsList.msgContent }}
				</view>
			</view>
		</view>
		<qm-tabs name="消息详情"></qm-tabs>
	</view>
</template>

<script>
	import request from "@/utils/request.js"

	export default {
		data() {
			return {
				newsList: {}
			}
		},
		onLoad() {
			this.newsList = uni.getStorageSync('newsList')
		}
	}
</script>

<style scoped lang="scss">
	.news_detailsList {
		font-size: 30upx;
		height: calc(100vh - 190upx);
		overflow-y: auto;
		line-height: 60upx;
		background: #f5f5f5;

		.detali-card {
			background-color: #fff;
			margin: 30upx;
			border-radius: 10upx;

			.card-header {
				display: flex;
				line-height: 80upx;
				height: 80upx;
				border-bottom: 2upx solid #e1e1e1;
				padding: 0 20upx;

				image {
					width: 40upx;
					height: 40upx;
					margin-top: 20upx;
					margin-right: 20upx;
				}

				.title {
					flex: 1;
					font-size: 28upx;
					color: #333;
				}

				.time {
					width: 200upx;
					font-size: 24upx;
					color: #999;
					text-align: right;
				}
			}

			.card-content {
				padding: 20upx;
			}
		}
	}
</style>
