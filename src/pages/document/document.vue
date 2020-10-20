<template>
	<view class="documentPages">
		<qm-navbar title="我的单据"></qm-navbar>
		<uni-search-bar @confirm="search" :radius="100" class="searchbar" />
		<view class="document-content">
			<view class="document-list">
				<view class="document-item" v-for="(item,i) in documrntList" :key='i'>
					<view class="item-header">
						<view class="item-header-title">
							收票登记（内贸）
						</view>
						<view class="item-header-time">
							{{item.createDate ? item.createDate.slice(0, 10) : "" }}
						</view>
					</view>
					<view class="item-content">
						合同号 : {{item.receiveNo}}
					</view>
					<view class="item-bottom">
						<button type="primary" size="mini" @click="editDetile(item)">编辑</button>
						<button type="primary" size="mini" class="viewbtn" @click="detaile(item)">查看</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				documrntList: [],
				searchQuery: ''
			}
		},
		onShow() {
			this.getList(null)
		},
		methods: {
			search(e) {
				let val = e.value
				this.searchQuery = val
				if (!this.searchQuery) {
					this.getList('')
				} else {
					this.getList(this.searchQuery)
				}
			},
			async getList(e) {
				const res = await request.post('/vrm/api/invoice/domesticReceive/list', {
					data: {
						receiveNo: e
					},
					funcModule: '收票登记（内贸）查看',
					funcOperation: '查看'
				})
				this.documrntList = res.data
			},
			detaile(item) {
				this.$Router.replace({
					path: '/pages/handle/index',
					query: {
						optype: 'view',
						receiveNo: item.receiveNo
					}
				})
			},
			editDetile(item) {
				this.$Router.replace({
					path: '/pages/invoice-registration/invoice-registration',
					params: {
						optype: 'edit',
						receiveNo: item.receiveNo
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.documentPages {
		background-color: #f5f5f5;

		.searchbar {
			margin: 10upx 30upx;
			background-color: #f5f5f5;
		}

		.document-content {
			height: calc(100vh - 210upx);
			overflow: scroll;

			.document-list {
				font-size: 24upx;

				.document-item {
					margin: 10upx 30upx;
					background-color: #fff;
					padding: 20upx;
					border-radius: 10upx;

					.item-header {
						display: flex;

						.item-header-title {
							flex: 1;
							color: #2484cf;
						}

						.item-header-time {
							width: 150upx;
							color: #999;
							font-size: 20upx;
							text-align: right;
						}
					}

					.item-content {
						color: #666;
						padding: 20upx;
						font-size: 24upx;
						line-height: 42upx;
					}

					.item-bottom {
						text-align: right;
						line-height: 50upx;

						uni-button {
							margin-left: 10upx;
							border-radius: 50upx;
						}

						.viewbtn {
							color: rgb(0, 143, 255);
							background: rgb(212, 233, 252);
						}
					}


				}
			}
		}
	}
</style>
