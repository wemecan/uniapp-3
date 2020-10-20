<template>
	<view class="purBatchPages">
		<qm-navbar title="采购批次选择" :event='goBack' btnName='确定' @myEvent='onHeaderConfirm'></qm-navbar>
		<qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
			<view slot="drawer">
				<view class="drawer-item">
					<view class="item-lable">
						签订开始时间
					</view>
					<picker mode="date" class="item-input" v-model="formData.signDateFrom" @change="bindStartDateChange">
						<view class="uni-input">{{ formData.signDateFrom }}</view>
					</picker>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						签订结束时间
					</view>
					<picker mode="date" class="item-input" v-model="formData.signDateTo" @change="bindEndDateChange">
						<view class="uni-input">{{ formData.signDateTo }}</view>
					</picker>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						{{ type === '0' ? '批次号' : '提单号' }}
					</view>
					<view class="item-input">
						<input type="text" value="" v-model="formData.lotNo" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						供应商
					</view>
					<view class="item-input">
						<picker mode="selector" @change="bindPickerChangesup" :value="suppindex" :range="supplierList" v-model="formData.supplierCode">
							<view>{{supplierList[suppindex]}}</view>
						</picker>
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
			<view class="pricepurBatchList">
				<view class="priceBatch-item" v-for="(item,i) in purBatchList" :key='i'>
					<view class="confirm-header">
						<view class="confirm-header-badge">
							<view class="tag" v-if="type === '0'">
								{{item.tradeType | dataDictFormat('tradeType') }}
							</view>
							<view class="tag" v-if="type=== '1'">
								{{ i + 1 }}
							</view>
						</view>
						<view class="confirm-header-title">
							{{ item.supplierNames }}
						</view>
						<view class="confirm-header-time" v-if="type === '0'">
							{{item.signDate | dateFormate}}
						</view>
						<view class="confirm-header-time" v-if="type=== '1'">
							{{item.ladingDate | dateFormate}}
						</view>
					</view>
					<view class="purBatch-con">
						<view class="confirm-content">
							<view>{{ item.contractNo }}</view>
							<view class="">
								{{ type === '0' ? '批次号' : '提单号'}}：{{ type === '0' ? item.lotNo : item.ladingBillNo }}
							</view>
							<view class="">
								{{ item.productName }}：{{ item.brand }}-{{ item.origin }}-{{ item.spec }}
							</view>
							<view>
								数量(单位)：{{ item.productQuantity || item.restMeasurementQuantity }}{{ item.productUnitCode | dataDictFormat('goodsUnit') }}
							</view>
						</view>
						<view class="confirm-header-bottom">
							<button type="primary" v-bind:data-val="item.num" v-if="!item.disabled" size="mini" @click="onJoin(item)">立即加入</button>
							<button type="primary" size="mini" v-if="item.disabled" style="opacity: 0.5;" @click="offJoin(item)">取消加入</button>
						</view>
					</view>
					<view class="quantityWrap">
						<view class="quantity-con">
							<view class="con">
								<text v-if="item.inQuantityEdit" class="num" v-bind:data-val="item.num1">{{ item.inQuantity }}</text>
								<input type="number" v-model="item.inQuantity" v-if="!item.inQuantityEdit" @blur='inQuantitySet(item)' />
								<view>
									{{ item.productUnitCode | dataDictFormat('goodsUnit') }}
								</view>
								<uni-icons type="compose" color="#2484cf" v-if="item.inQuantityEdit" @click="editClick1(item)"></uni-icons>
							</view>
							<text class="text">数量</text>
						</view>
						<view class="quantity-con">
							<view class="con">
								<text v-if="item.measurementQuantityEdit" v-bind:data-val="item.num2" class="num">{{ item.measurementQuantity }}</text>
								<input type="number" v-model="item.measurementQuantity" v-bind:data-val="item.num2" v-if="!item.measurementQuantityEdit"
								 @blur='measurementQuantitySet(item)' />
								<view>
									{{ item.productUnitCode | dataDictFormat('goodsUnit') }}
								</view>
								<uni-icons type="compose" color="#2484cf" v-bind:data-val="item.num2" v-if="item.measurementQuantityEdit"
								 @click="editClick2(item)"></uni-icons>
							</view>
							<text class="text">计量数量</text>
						</view>
						<view class="quantity-con">
							<view class="con">
								<text class="">￥</text>
								<text v-if="item.includeTaxPriceEdit" v-bind:data-val="item.num3" class="num">{{ item.includeTaxPrice }}</text>
								<input type="number" v-model="item.includeTaxPrice" v-bind:data-val="item.num3" v-if="!item.includeTaxPriceEdit"
								 @blur='includeTaxPriceSet(item)' />
								<uni-icons type="compose" color="#2484cf" v-bind:data-val="item.num3" v-if="item.includeTaxPriceEdit" @click="editClick3(item)"></uni-icons>
							</view>
							<text class="text">单价</text>
						</view>
					</view>
				</view>
				<view v-if="!hasMore" class="more">
					---------- 没有更多了 -----------
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				array: ['全部', '转口', '进口', '内贸'],
				current: 1,
				btnDisabled: true,
				hasMore: true,
				productList: ['请选择商品'],
				supplierList: ['请选择供应商'],
				supplierListAll: [],
				productListAll: [],
				index: 0,
				type: '0',
				suppindex: 0,
				purBatchList: [],
				formData: {
					signDateFrom: "",
					signDateTo: "",
					bizEmployeeCode: "",
					contractNo: "",
					deliveryMarketCode: "",
					hasRmnFlg: "",
					lotNo: "",
					productCode: "",
					qmQueryExtras: [],
					supplierCode: "",
					tradeType: "",
					tradeTypeList: []
				},
				ladingNoFormData: {
					ladingBillNo: "",
					productCodeList: [],
					qmQueryExtras: [],
					supplierCode: ""
				}
			}
		},
		onShow() {
			this.getList()
			this.getProductList()
			this.getSupplierList()
		},
		onLoad() {
			this.type = this.$Route.query.type
		},
		methods: {
			async getProductList() {
				const res = await request.post('/vrm/api/dd/selectData/list', {
					funcModule: "入库通知新增",
					funcOperation: "查询",
					isPage: true,
					size: 20,
					sortString: "docMakeDt.desc",
					data: {
						type: "DD_SPOT_MARKET",
					}
				})
				res.data.forEach((item) => {
					this.productList.push(item.name)
				})
				this.productListAll = res.data
			},
			async getSupplierList() {
				const res = await request.post('/vrm/api/dd/selectData/list', {
					funcModule: "入库通知新增",
					funcOperation: "查询",
					isPage: true,
					size: 20,
					sortString: "docMakeDt.desc",
					data: {
						type: "CUST_INFO",
						queryParams: {
							auditStatus: "3",
							typeCode: "2",
							usingFlag: "1"
						}
					}
				})
				res.data.forEach((item) => {
					this.supplierList.push(item.name)
				})
				this.supplierListAll = res.data
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
			bindPickerChangesup(e) {
				this.suppindex = e.target.value
				if (this.supplierListAll[this.suppindex - 1]) {
					this.formData.productCode = this.supplierListAll[this.suppindex - 1].code
				} else {
					this.formData.productCode = ''
					this.index = 0
				}
			},
			bindStartDateChange(e) {
				this.formData.signDateFrom = this.dateFormate(e.target.value)
			},
			bindEndDateChange(e) {
				this.formData.signDateTo = this.dateFormate(e.target.value)
			},
			dateFormate(date) {
				if (date) {
					const year = new Date(date).getFullYear() + "";
					const month =
						new Date(date).getMonth() + 1 > 9 ?
						new Date(date).getMonth() + 1 :
						"0" + (new Date(date).getMonth() + 1);
					const day =
						new Date(date).getDate() > 9 ?
						new Date(date).getDate() :
						"0" + new Date(date).getDate();
					return year + month + day;
				}
			},
			onChangeLeft(val) {
				this.formData.tradeType = val === 1 ? '1' : val === 2 ? '2' : '3'
				this.current = 1
				this.getList()
			},
			goBack() {
				this.$Router.replace({
					path: '/pages/storage-notice/storage-notice',
					params: this.$Route.query
				})
			},
			onReset() {
				this.index = 0
				this.suppindex = 0
				this.formData.signDateFrom = ""
				this.formData.signDateTo = ""
				this.formData.lotNo = ""
				this.formData.supplierCode = ""
				this.formData.productCode = ""
			},
			onConfirm() {
				this.$refs.filter.closeDrawer()
				this.current = 1
				this.getList()
			},
			editClick1(item) {
				item.inQuantityEdit = !item.inQuantityEdit
				this.$set(item, 'num1', 0)
			},
			editClick2(item) {
				item.measurementQuantityEdit = !item.measurementQuantityEdit
				this.$set(item, 'num2', 0)
			},
			editClick3(item) {
				item.includeTaxPriceEdit = !item.includeTaxPriceEdit
				this.$set(item, 'num3', 0)
			},
			onHeaderConfirm() {
				const purBatchList = this.purBatchList.filter(item => item.disabled)
				if (purBatchList.length === 0) {
					uni.showToast({
						title: '请选择一条信息',
						icon: 'none'
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请确认当前数据已经准确无误，是否确定保存？',
						success: (res) => {
							if (res.confirm) {
								let listNo = []
								purBatchList.forEach((item) => {
									const contractNo = item.contractNo + "-" + item.lotNo
									if (!listNo.includes(contractNo)) listNo.push(contractNo)
									item.inBillCostList = []
								})
								if (listNo.length > 1) {
									uni.showToast({
										icon: 'none',
										title: '只允许选择相同合同批次号'
									})
									return
								}
								let inProductList = []
								const storeId = this.$Route.query.inProductList.map(item => item.contractNo + "-" + item.lotNo)[0]
								if (!listNo.includes(storeId)) {
									inProductList = this.$Route.query.inProductList.concat(purBatchList)
								} else {
									inProductList = purBatchList
								}
								this.$Router.replace({
									path: '/pages/storage-notice/storage-notice',
									params: {
										...this.$Route.query,
										inProductList
									}
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				}
			},
			async getList() {
				let list = []
				if (this.type === "0") {
					const res = await request.post('/vrm/api/contract/plProductDetail/listChooseStorage', {
						current: this.current,
						data: this.formData,
						funcModule: "入库通知新增",
						funcOperation: "查询",
						isPage: true,
						size: 20,
						sortString: "docMakeDt.desc",
					})
					res.data.forEach((item) => {
						item.inQuantity = item.productQuantity
						this.$set(item, 'num', 0)
					})
					list = res.data
				} else if (this.type === "1") {
					const res = await request.post('/vrm/api/warehouse/whLadingBillProduct/page', {
						current: this.current,
						funcModule: "入库通知新增",
						funcOperation: "查询",
						isPage: true,
						size: 20,
						sortString: "ladingDate.desc,contractNo.desc,lotNo.desc,ladingBillNo.desc",
						data: this.ladingNoFormData
					})
					res.data.forEach((item) => {
						this.$set(item, 'num', 0)
						item.inQuantity = item.restQuantity
						item.measurementQuantity = item.restMeasurementQuantity
					})
					list = res.data
				}
				if (this.current === 1) {
					this.purBatchList = list
				} else {
					this.purBatchList = [...this.purBatchList, ...list]
				}
				this.purBatchList.map(item => {
					this.$set(item, "disabled", false)
				})
				if (list.length < 20) {
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
			onCancelEdit(item) {
				item.inQuantityEdit = true;
				item.measurementQuantityEdit = true;
				item.includeTaxPriceEdit = true;
			},
			onActiveEdit(item) {
				item.inQuantityEdit = false;
				item.measurementQuantityEdit = false;
				item.includeTaxPriceEdit = false;
			},
			onJoin(item, i) {
				this.purBatchList.map(item => {
					this.$set(item, "num", 0)
				})
				item.disabled = true;
				this.onCancelEdit(item);
				this.$set(item, "num", 1)
			},
			offJoin(item) {
				this.$set(item, "num", 0)
				item.disabled = false;
				this.onActiveEdit(item);
			},

			inQuantitySet(item) {
				this.$set(item, "num1", 1)
				item.inQuantityEdit = true
				item.inQuantity = item.inQuantity > item.productQuantity ? item.productQuantity : item.inQuantity
				item.inQuantity = item.inQuantity < 0 ? 0 : item.inQuantity
			},
			measurementQuantitySet(item) {
				this.$set(item, "num2", 1)
				item.measurementQuantityEdit = true
				item.measurementQuantity = item.measurementQuantity > item.rmnPrdQty ? item.rmnPrdQty : item.measurementQuantity
				item.measurementQuantity = item.measurementQuantity < 0 ? 0 : item.measurementQuantity
			},
			includeTaxPriceSet(item) {
				this.$set(item, "num3", 1)
				item.includeTaxPriceEdit = true
			}
		}
	}
</script>

<style scoped lang="scss">
	.opciton {
		opacity: 0.5;
	}

	.purBatchPages {
		background: #f5f5f5;

		.priceBatchcon {
			height: calc(100vh - 170upx);
			overflow: scroll;
			background-color: #F5F5F5;
		}

		.more {
			font-size: 28upx;
			text-align: center;
			color: #999;
			margin: 20upx 0;
		}

		.pricepurBatchList {

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
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.confirm-header-time {
					width: 150upx;
					color: #999;
					font-size: 20upx;
					border-radius: 50upx;
					text-align: right;
				}
			}

			.purBatch-con {
				display: flex;

				.confirm-content {
					color: #666;
					padding: 20upx;
					font-size: 24upx;
					line-height: 42upx;
					width: 60%;
				}

				.confirm-header-bottom {
					text-align: right;
					line-height: 50upx;
					flex: 1;
					margin-top: 80upx;

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

			.quantityWrap {
				padding: 0 10upx;
				display: flex;

				.quantity-con {
					flex: 1;
				}

				.con {
					text-align: center;
					line-height: 64upx;

					.num {
						width: 50%;
					}

					view {
						display: inline-block;
						padding-right: 10upx;
					}

					uni-icons {
						display: inline-block;
					}
				}

				input {
					display: inline-flex;
					width: 40%;
					border: 1px solid #eee;
					margin-right: 10upx;
					line-height: 64upx;
				}

				.text {
					display: block;
					text-align: center;
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
</style>
