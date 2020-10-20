<template>
	<view>
		<qm-navbar title="定价批次详情" url="/pages/price-registration/price-batch/price-batch"></qm-navbar>
		<view class="confirmDetaile">
			<view class="confirmDetaile-card">
				<view class="confirmDetaile-title">
					基本信息
				</view>
				<view class="confirmDetaile-con">
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价批次号
						</view>
						<view class="item-right">
							{{formData.pricingLotCode}}
						</view>
					</view>
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
							定价批次号
						</view>
						<view class="item-right">
							{{formData.pricingLotCode}}
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
							定价开始日
						</view>
						<view class="item-right">
							{{formData.pricingTimeStart | dateFormate}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价结束日
						</view>
						<view class="item-right">
							{{formData.pricingTimeEnd | dateFormate}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							定价数量
						</view>
						<view class="item-right">
							{{formData.pricingQuantity }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							未登记数量
						</view>
						<view class="item-right">
							{{formData.rmnMemQty }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							计量单位
						</view>
						<view class="item-right">
							{{formData.valueUnit | dataDictFormat('measurementUnit')}}
						</view>
					</view>

					<view class="confirmDetaile-item">
						<view class="item-left">
							升贴水
						</view>
						<view class="item-right">
							{{formData.premium }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							制单人
						</view>
						<view class="item-right">
							{{formData.docMaker }}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							制单日期
						</view>
						<view class="item-right">
							{{formData.docMakeDate | dateFormate}}
						</view>
					</view>
					<view class="confirmDetaile-item">
						<view class="item-left">
							备注
						</view>
						<view class="item-right">
							{{formData.note}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					pricingLotCode: '',
					contractCode: '',
					purchaseOrSale: '',
					currency: '',
					productName: '',
					pricingType: '',
					pricingItemName: '',
					pricingTimeStart: '',
					pricingTimeEnd: '',
					pricingQuantity: '',
					rmnMemQty: '',
					docMaker: '',
					valueUnit: '',
					premium: '',
					docMakeDate: '',
					note: '',
				}
			}
		},
		onShow() {
			this.formData =uni.getStorageSync('batchDetails')
		},
		onUnload() {
			uni.removeStorageSync('batchDetails')
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
