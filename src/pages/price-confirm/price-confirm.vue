<template>
	<view class="priceConfirmPages">
		<qm-navbar title="定价确认"></qm-navbar>
		<qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
			<view slot="drawer">
				<view class="drawer-item">
					<view class="item-lable">
						定价登记号
					</view>
					<view class="item-input">
						<input type="text" value="" v-model="formData.pricingCode" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						合同号
					</view>
					<view class="item-input">
						<input type="text" v-model="formData.contractCode" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						商品名称
					</view>
					<view class="item-input">
						<picker mode="selector" @change="bindPickerChange" :value="index" :range="productList">
							<view>{{productList[index]}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-btn-v">
					<button type="default" size="mini" class="reset" @click="onReset">重置</button>
					<button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
				</view>
			</view>

		</qm-filters>
		<scroll-view scroll-y="true" class="priceConfirmcon" lower-threshold='50' @scrolltolower="lower">
			<view class="priceConfirmList">
				<view class="priceConfirm-item" v-for="(item,i) in confirmList" :key='i'>
					<view class="confirm-header">
						<view class="confirm-header-badge">
							<view class="tag" v-if="item.confirmStatus=='1'">
								已确认
							</view>
							<view class="tag" v-if="item.confirmStatus=='0'">
								未确认
							</view>
						</view>
						<view class="confirm-header-title">
							{{ item.pricingLotCode }}
						</view>
						<view class="confirm-header-time">
							{{item.pricingTime | dateFormate}}
						</view>
					</view>
					<view class="confirm-content">
						<view>{{ item.contractCode }}</view>
						<view class="">
							商品|定价方式|定价基准：{{ item.productName }}|{{ item.pricingType | dataDictFormat('pricingType') }}|{{
							item.pricingItemName}}
						</view>

						<view>
							购销类型: {{ item.purchaseOrSale | dataDictFormat('purchaseOrSale') }}
						</view>
						<view>
							定价数量(单位): {{ item.pricingQuantity}}({{item.valueUnit| dataDictFormat('measurementUnit') }})
						</view>
						<view>
							确认数量：{{ item.confirmQuantity}}({{item.valueUnit | dataDictFormat('measurementUnit')}})
						</view>
					</view>
					<view class="confirm-header-bottom">
						<button type="primary" size="mini">定价确认</button>
						<button type="primary" size="mini" class="viewbtn" @click="detaile(item)">查看详情</button>
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
				<qm-dialog-list ref="uniPop" fileName='priceConfirmDetail' :queryParams='popItem' @hideClick='hideClick'></qm-dialog-list>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	export default {
		data() {
			return {
				confirmList: [],
				productList: ['请选择商品'],
				productListAll: [],
				array: ['全部', '已确认', '未确认'],
				index: 0,
				current: 1,
				hasMore: true,
				dialogVisible: false,
				popItem: {},
				formData: {
					pricingCode: '',
					contractCode: '',
					productCode: '',
					confirmStatus: '',
				},
			}
		},
		onShow() {
			this.getProductList()
			this.getList()
		},
		methods: {
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
			hideClick(va) {
				this.dialogVisible = false
			},
			async getList() {
				const res = await request.post('/vrm/api/pricingInfo/listForConfirm', {
					defaultSortString: 'pricingCode.desc',
					funcModule: '定价确认',
					funcOperation: '查询',
					isPage: true,
					size: 20,
					current: this.current,
					data: this.formData,
				})
				this.confirmList = [...this.confirmList, ...res.data]
				if (res.data.length < 20) {
					this.hasMore = false
					return
				}
			},
			detaile(item) {
				this.dialogVisible = true
				this.popItem = item
			},
			onChangeLeft(val) {
				this.formData.confirmStatus = val === 1 ? '1' : val === 2 ? '0' : ''
				this.current = 1
				this.confirmList = []
				this.getList()
			},
			onReset() {
				this.index = 0;
				(this.formData.pricingCode = ''),
				(this.formData.productCode = ''),
				(this.formData.contractCode = '')
			},
			onConfirm() {
				this.$refs.filter.closeDrawer()
				this.current = 1
				this.confirmList = []
				this.getList()
			},
			lower() {
				if (this.hasMore) {
					this.current += 1
					this.getList()
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.priceConfirmPages {
		.priceConfirmcon {
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

		.priceConfirmList {
			font-size: 28upx;

			.priceConfirm-item {
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

		.drawer-item {
			margin-bottom: 20upx;

			.item-lable {
				width: 130upx;
				text-align: left;
			}

			.item-input {
				flex: 1;
				height: 52upx;
				line-height: 52upx;
				background-color: #f9f9f9;
				font-size: 24upx;
				border: 1px solid #f5f5f5;
				text-align: left;
				padding-left: 20upx;
			}

			.msgClass {
				display: flex;
				font-size: 24upx;
				height: 52upx;
				line-height: 52upx;

				.msgClass-input {
					flex: 1;
					font-size: 22upx;
					background: #f1f1f1;
					border: 1px solid #d3d3d3;
					margin: 0 5upx;
					color: #666;
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
