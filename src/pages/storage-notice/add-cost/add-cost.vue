<template>
	<view>
		<qm-navbar title="新建入库单"></qm-navbar>
		<view class="storage-wrap">
			<view class="storage-list">
				<!-- 结算单位 -->
				<view class="storage-item">
					<view class="item-left danger">
						结算单位*
					</view>
					<view class="item-right">
						<picker :value="settlementIndex" :range="settlementList" :range-key="'name'" @change="settlementChange">
							<view class="uni-input">
								{{formData.settlementName}}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<!-- 费用方向 -->
				<view class="storage-item">
					<view class="item-left danger">
						费用方向*
					</view>
					<view class="item-right">
						<picker :value="feeDirectionIndex" :range="feeDirectionList" :range-key="'label'" @change="feeDirectionChange">
							<view class="uni-input">
								{{formData.feeDirection | dataDictFormat('feeDirection') }}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<!-- 费用名称 -->
				<view class="storage-item">
					<view class="item-left danger">
						费用名称*
					</view>
					<view class="item-right">
						<picker :value="feeIndex" :range="feeList" :range-key="'name'" @change="feeChange">
							<view class="uni-input">
								{{formData.feeName}}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="storage-item">
					<view class="item-left danger">
						含税单价*
					</view>
					<view class="item-right">
						<input type="number" placeholder="请输入含税单价" @input="inputChange1" :value="formData.includeTaxPrice" />
					</view>
				</view>
				<view class="storage-item">
					<view class="item-left danger">
						税率*
					</view>
					<view class="item-right">
						<input type="number" placeholder="请输入含税单价" @input="inputChange2" :value="formData.taxRate" />
					</view>
				</view>
				<view class="storage-item">
					<view class="item-left danger">
						含税金额*
					</view>
					<view class="item-right">
						{{ formData.includeTaxPrice * formData.quantity || 0 }}
					</view>
				</view>
				<view class="storage-item">
					<view class="item-left ">
						进成本
					</view>
					<view class="item-right">
						<label class="radio">
							<checkbox :checked="formData.costFlag" @click="checkBox2()" />
						</label>
					</view>
				</view>
				<view class="storage-item">
					<view class="item-left ">
						进往来
					</view>
					<view class="item-right">
						<label class="radio">
							<checkbox :checked="formData.intercourseFlag" @click="checkBox($event)" />
						</label>
					</view>
				</view>

			</view>
		</view>
		<view class="bottom-btn">
			<button class="agree" @click="doAgree">确定</button>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				feeDirectionList: [],
				settlementList: [],
				feeList: [],
				settlementIndex: 0,
				feeDirectionIndex: 0,
				feeIndex: 0,
				money: 0,
				formData: {
					settlementCode: "",
					settlementName: "",
					feeDirection: "",
					feeDirectionName: '',
					feeCode: "",
					feeName: "",
					includeTaxPrice: null,
					taxRate: null,
					quantity: 0,
					includeTaxAmount: 0,
					costFlag: true,
					intercourseFlag: true

				}
			}
		},
		async onShow() {
			this.feeDirectionList = this.$store.state.dictData.feeDirection
			// 获取部门信息
			const settlementList = await this.getconList({
				queryParams: {
					usingFlag: "1",
					auditStatus: "3"
				},
				type: "CUST_INFO"
			})
			// 获取业务机构信息（x下拉）
			const feeList = await this.getconList({
				queryParams: {
					usingFlag: "1"
				},
				type: "DD_FEE_TYPE"
			})
			this.settlementList = settlementList.data;
			this.feeList = feeList.data
		},
		onLoad() {
			const {
				inQuantity,
				productName,
				productCode,
				brand,
				origin,
				spec,
				productDetailNo,
				currency,
				productKeyAttr01,
				productKeyAttr02,
				productKeyAttr03,
			} = this.$Route.query.currentProductInfo
			this.formData = Object.assign(this.formData, {
				quantity: inQuantity,
				productName,
				productCode,
				brand,
				origin,
				spec,
				lotProductDetailCode: productDetailNo,
				preBillProductDetailCode: productDetailNo,
				currencyCode: currency,
				productKeyAttr01,
				productKeyAttr02,
				productKeyAttr03,
			})
		},
		methods: {
			inputChange1(e) {
				this.formData.includeTaxPrice = e.detail.value
			},
			inputChange2(e) {
				this.formData.taxRate = e.detail.value
			},
			getMoney() {
				return this.formData.includeTaxPrice * this.formData.quantity
			},
			checkBox(e) {
				this.formData.intercourseFlag = !this.formData.intercourseFlag
			},
			checkBox1(e) {
				this.formData.costFlag = !this.formData.costFlag
			},
			doAgree() {
				if (
					!this.formData.settlementCode ||
					!this.formData.feeDirection ||
					!this.formData.feeCode ||
					!this.formData.includeTaxPrice ||
					!this.formData.taxRate
				) {
					uni.showToast({
						title: '必填项不得为空',
						icon: 'none'
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '是否确定添加？',
						success: (res) => {
							if (res.confirm) {
								this.formData.includeTaxAmount = this.formData.includeTaxPrice * this.formData.quantity
								this.formData.costFlag = this.formData.costFlag ? '1' : '0'
								this.formData.intercourseFlag = this.formData.intercourseFlag ? '1' : '0'
								let inProductList = this.$Route.query.inProductList
								inProductList[this.$Route.query.index].inBillCostList.push(this.formData)
								console.log(inProductList)
								this.$Router.push({
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
			getconList(parmas) {
				return request.post('/vrm/api/dd/selectData/list', {
					funcModule: "入库通知新增",
					funcOperation: "查询",
					data: parmas
				})
			},

			settlementChange(e) {
				this.settlementIndex = e.detail.value
				this.formData.settlementCode = this.settlementList[this.settlementIndex].code
				this.formData.settlementName = this.settlementList[this.settlementIndex].name
			},
			feeDirectionChange(e) {
				this.feeDirectionIndex = e.detail.value
				this.formData.feeDirection = this.feeDirectionList[this.feeDirectionIndex].value
				this.formData.feeDirectionName = this.feeDirectionList[this.feeDirectionIndex].label
			},
			feeChange(e) {
				this.feeIndex = e.detail.value
				this.formData.feeCode = this.feeList[this.feeIndex].code
				this.formData.feeName = this.feeList[this.feeIndex].name
			},

		}
	}
</script>

<style scoped lang="scss">
	.storage-wrap {
		height: calc(100vh - 88upx);
		background-color: #f5f5f5;
		overflow: scroll;

		.storage-list {
			font-size: 28upx;

			.storage-item {
				padding-left: 20upx;
				padding-right: 20upx;
				background-color: #fff;
				display: flex;
				line-height: 86upx;
				border-bottom: 1px solid #f5f5f5;

				.item-left {
					width: 225upx;
				}

				.item-right {
					width: 525upx;
					text-align: right;
					line-height: 86upx;
					font-size: 24upx;

					.uni-input {
						display: inline-flex;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

					}

					uni-input {
						margin-top: 24upx;
						font-size: 24upx;
					}
				}
			}
		}
	}

	.bottom-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 106upx;
		align-items: center;

		uni-button {
			width: 90%;
			height: 70upx;
			line-height: 70upx;
			color: #ffffff;
			font-size: 32upx;
			background-color: #2484cf;
		}
	}
</style>
