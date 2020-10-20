<template>
	<view class="batchPages">
		<qm-navbar title="定价登记选择" :event='goBack' btnName='确定' @myEvent='onHeaderConfirm'></qm-navbar>
		<qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
			<view slot="drawer">
				<view class="drawer-item">
					<view class="item-lable">
						定价批次号
					</view>
					<view class="item-input">
						<input type="text" value="" v-model="formData.pricingLotCode" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						合同号
					</view>
					<view class="item-input">
						<input type="text" value="" v-model="formData.contractCode" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						商品名称
					</view>
					<view class="item-input">
						<picker mode="selector" @change="bindPickerChange" :value="index" :range="productList" v-model="formData.productCode">
							<view>{{productList[index]}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-btn-v">
					<button type="default" size="mini" class="reset">重置</button>
					<button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
				</view>
			</view>
		</qm-filters>
		<scroll-view scroll-y="true" class="priceBatchcon" lower-threshold='50' @scrolltolower="lower">
			<view class="priceBatchList">
				<view class="priceBatch-item" v-for="(item,i) in batchList" :key='i'>
					<view class="confirm-header">
						<view class="confirm-header-badge">
							<view class="tag">
								{{item.purchaseOrSale | dataDictFormat('purchaseOrSale') }}
							</view>
						</view>
						<view class="confirm-header-title">
							{{ item.pricingLotCode }}
						</view>
						<view class="confirm-header-time">
							{{item.updateDate | dateFormate}}
						</view>
					</view>
					<view class="confirm-content">
						<view>{{ item.contractNo }}</view>
						<view class="">
							商品|定价方式|定价基准：{{ item.productName }}|{{ item.pricingType | dataDictFormat('pricingType') }}|{{
							item.pricingItemName}}
						</view>

						<view>
							定价数量(单位): {{ item.pricingQuantity}}({{item.valueUnit| dataDictFormat('measurementUnit') }})
						</view>
						<view>
							未登记数量: {{ item.rmnMemQty}}({{item.valueUnit| dataDictFormat('measurementUnit') }})
						</view>
						<view>
							升贴水：{{ item.premium}}
						</view>
					</view>
					<view class="confirm-header-bottom">
						<button type="primary" size="mini" class="viewbtn" @click="detaile(item)">查看详情</button>
						<button type="primary" v-bind:data-val="item.num" v-if="!item.disabled" size="mini" @click="onJoin(item)">立即加入</button>
						<button type="primary" size="mini" v-if="item.disabled" style="opacity: 0.5;" @click="offJoin(item)">取消加入</button>
					</view>
				</view>
				<view v-if="!hasMore" class="more">
					---------- 没有更多了 -----------
				</view>
			</view>
		</scroll-view>
		<view class="dialog" v-if='dialogVisible'>
			<view class="mask">
			</view>
			<view class="dialogCon">
				<qm-dialog-list ref="uniPop" fileName='priceBatchDetail' :queryParams='popItem' @hideClick='hideClick'></qm-dialog-list>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	export default {
		data() {
			return {
				array: ['全部', '采购', '销售'],
				current: 1,
				btnDisabled: true,
				hasMore: true,
				productList: ['请选择商品'],
				index: 0,
				dialogVisible: false,
				popItem: {},
				batchList: [],
				formData: {
					contractCode: '',
					pricingLotCode: '',
					productCode: '',
					qmQueryExtras: [],
				},
			}
		},
		onShow() {
			this.getList()
			this.getProductList()
		},
		methods: {
			hideClick(va) {
				this.dialogVisible = false
			},
			async getProductList() {
				const res = await request.post('/vrm/api/dd/selectData/list', {
					funcModule: '定价确认',
					funcOperation: '查询',
					data: {
						type: 'DD_PRODUCT',
					},
				})
				res.data.forEach((item) => {
					this.productList.push(item.name)
				})
				this.productListAll = res.data
			},
			bindPickerChange(e) {
				this.index = e.target.value
				if (this.productListAll[this.index - 1]) {
					this.formData.productCode = this.productListAll[this.index - 1].code
				} else {
					this.formData.productCode = ''
					this.index = 0
				}
			},
			onChangeLeft(val) {
				this.formData.purchaseOrSale = val === 1 ? 'P' : val === 2 ? 'S' : ''
				this.current = 1
				this.getList()
			},
			goBack() {
				this.$Router.replace('/pages/price-registration/price-registration')
			},
			onReset() {
				this.index = 0;
				(this.formData.pricingLotCode = ''),
				(this.formData.productCode = ''),
				(this.formData.contractCode = ''),
				(this.formData.qmQueryExtras = [])
			},
			onConfirm() {
				this.$refs.filter.closeDrawer()
				this.current = 1
				this.getList()
			},
			onHeaderConfirm() {
				const batchList = this.batchList.filter((item) => item.disabled)
				if (batchList.length === 0) {
					uni.showToast({
						title: '请选择一条信息',
						icon: 'none',
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请确认当前数据已经准确无误，是否确定保存？',
						success: (res) => {
							if (res.confirm) {
								uni.setStorageSync('priceList', batchList[0])
								this.$Router.replace(
									'/pages/price-registration/price-registration'
								)
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						},
					})
				}
			},
			async getList() {
				const res = await request.post('/vrm/api/pricingLot/listForReg', {
					current: this.current,
					data: this.formData,
					funcModule: '定价登记新增',
					funcOperation: '查询',
					isPage: true,
					size: 20,
				})
				if (this.current === 1) {
					this.batchList = res.data
				} else {
					this.batchList = [...this.batchList, ...res.data]
				}
				if (res.data.length < 20) {
					this.hasMore = !this.hasMore
					return
				}
			},
			lower() {
				if (this.hasMore) {
					this.current += 1
					this.getList()
				}
			},
			detaile(item) {
				this.dialogVisible = true
				this.popItem = item
			},
			onJoin(item, i) {
				this.batchList.map((item) => {
					this.$set(item, 'disabled', false)
					this.$set(item, 'num', 0)
				})
				this.$set(item, 'disabled', !item.disabled)
				this.$set(item, 'num', 1)
			},
			offJoin(item) {
				this.$set(item, 'disabled', !item.disabled)
				this.$set(item, 'num', 1)
			},
		},
	}
</script>

<style scoped lang="scss">
	.opciton {
		opacity: 0.5;
	}

	.batchPages {
		background: #f5f5f5;

		.priceBatchcon {
			height: calc(100vh - 170upx);
			overflow: scroll;
			background-color: #f5f5f5;
		}

		.more {
			font-size: 28upx;
			text-align: center;
			color: #999;
			margin: 20upx 0;
		}

		.priceBatchList {
			font-size: 28upx;

			.priceBatch-item {
				background-color: #fff;
				margin: 30upx;
				padding: 20upx;
			}

			.confirm-header {
				width: 100%;
				height: 60upx;
				line-height: 60upx;
				display: flex;

				.confirm-header-badge {
					width: 120upx;

					.tag {
						font-size: 20upx;
						padding: 4upx 16upx;
						border-radius: 50upx;
						color: #fff;
						display: inline-block;
						line-height: 30upx;
						color: rgb(0, 143, 255);
						background: rgb(212, 233, 252);
					}
				}

				.confirm-header-title {
					flex: 1;
				}

				.confirm-header-time {
					width: 150upx;
					color: #999;
					font-size: 20upx;
					border-radius: 50upx;
					text-align: right;
				}
			}

			.confirm-content {
				color: #666;
				padding: 20upx;
				font-size: 24upx;
				line-height: 42upx;
			}

			.confirm-header-bottom {
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

	.drawer-item {
		margin-bottom: 20upx;

		.item-lable {
			text-align: left;
		}

		.item-input {
			flex: 1;
			height: 52upx;
			line-height: 52upx;
			background-color: #f9f9f9;
			font-size: 24upx;
			border: 2upx solid #f5f5f5;
			text-align: left;
			padding-left: 20upx;
		}

		.msg {
			display: flex;
			font-size: 24upx;
			height: 52upx;
			line-height: 50upx;

			.msg-select {
				flex: 1;
				font-size: 22upx;
				background: #f1f1f1;
				border: 2upx solid #d3d3d3;
				margin: 0 5upx;
				color: #666;
			}

			.msg-select-active {
				color: #2484cf;
				background: #b7defc;
				border: 2upx solid #2484cf;
			}
		}
	}

	.uni-btn-v {
		position: absolute;
		bottom: 10upx;
		left: 30upx;
		right: 30upx;

		uni-button {
			width: 50%;

			&::after {
				border-radius: 0;
			}
		}

		.reset {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		.confirm {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}

	.dialog {
		.mask {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.2);
			position: absolute;
			top: 0;
		}

		.dialogCon {
			background-color: #fff;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
		}
	}
</style>
