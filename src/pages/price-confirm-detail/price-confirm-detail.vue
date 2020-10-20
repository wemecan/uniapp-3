<template>
	<view>
		<qm-navbar title="定价详情" url="/pages/price-confirm/price-confirm"></qm-navbar>
		<view class="confirmDetaile">
			<view class="confirmDetaile-card">
				<view class="confirmDetaile-title">
					基本信息
				</view>
				<view class="confirmDetaile-con">
					<view class="confirmDetaile-item">
						<view class="item-left">
							合同号
						</view>
						<view class="item-right">
							{{formData.contractCode}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							合同号
						</view>
						<view class="item-right">
							{{formData.productCode}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价登记号
						</view>
						<view class="item-right">
							{{formData.pricingCode}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							购销类型
						</view>
						<view class="item-right">
							{{formData.purchaseOrSale | dataDictFormat('purchaseOrSale') }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							币种
						</view>
						<view class="item-right">
							{{formData.currency | dataDictFormat('currency') }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							商品名称
						</view>
						<view class="item-right">
							{{formData.productName}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价方式
						</view>
						<view class="item-right">
							{{formData.pricingType | dataDictFormat('pricingType')}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价基准
						</view>
						<view class="item-right">
							{{formData.pricingItemName}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价日期
						</view>
						<view class="item-right">
							{{formData.pricingTime | dateFormate}}
						</view>
					</view>

				</view>
			</view>
			<view class="confirmDetaile-card">
				<view class="confirmDetaile-title">
					确认信息
				</view>
				<view class="confirmDetaile-con">
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价数量
						</view>
						<view class="item-right">
							{{formData.pricingQuantity}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							确认数量
						</view>
						<view class="item-right">
							{{formData.confirmQuantity}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							计量单位
						</view>
						<view class="item-right">
							{{formData.valueUnit}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							价格
						</view>
						<view class="item-right">
							{{formData.price }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							确认价格
						</view>
						<view class="item-right">
							{{formData.confirmPrice}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							确认说明
						</view>
						<view class="item-right">
							{{formData.confirmNote}}
						</view>
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
				pricingCode: '',
				formData: {
					pricingCode: '',
					contractCode: '',
					purchaseOrSale: '',
					currency: '',
					productName: '',
					pricingType: '',
					pricingItemName: '',
					pricingTime: '',
					pricingQuantity: '',
					confirmQuantity: '',
					valueUnit: '',
					price: '',
					confirmPrice: '',
					confirmNote: '',
				}
			}
		},
		onLoad() {
			this.pricingCode = this.$Route.query.pricingCode
		},
		onShow() {
			this.getList()
		},
		methods: {
			async getList() {
				const res = await request.post('/vrm/api/pricingInfo/getByCode', {
					funcModule: '定价确认修改',
					funcOperation: '查看',
					data: this.pricingCode,
				})
				this.formData = res.data
			}
		}
	}
</script>

<style scoped lang="scss">
	.confirmDetaile {
		height: calc(100vh - 90upx);
		background-color: #f5f5f5;
		overflow: hidden;

		.confirmDetaile-card {
			background-color: #fff;
			margin: 20upx 30upx;
			font-size: 24upx;
			padding: 20upx;
			border-radius: 10upx;

			.confirmDetaile-title {
				font-size: 28upx;
				font-weight: bold;
				color: #2485d0;
				line-height: 60upx;
			}

			.confirmDetaile-con {
				background-color: #fff;
				line-height: 60upx;

				.confirmDetaile-item {
					color: #666;
					display: flex;

					.item-left {
						flex: 1;
					}

					.item-right {
						flex: 1;
						text-align: right;
					}
				}

			}
		}
	}
</style>
