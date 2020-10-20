<template>
	<view class="supplierPages">
		<qm-navbar title="供应商" :event="goBack" btnName='确定' @myEvent='onConfirm'></qm-navbar>
		<uni-search-bar @confirm="search" :radius="100" class="searchbar" />
		<view class="supplierContent">
			<radio-group @change="radioChange">
				<label class="supplier-item" v-for="(item, index) in supplierList" :key="item.code">
					<view class="title">{{item.name}}</view>
					<view class="radioBox">
						<radio :value="item.code" :checked="index === current" />
					</view>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	export default {
		data() {
			return {
				current: '',
				supplierList: [],
				supplierCode: '',
			}
		},
		onShow(option) {
			this.getList()
		},
		methods: {
			goBack() {
				// this.$Router.replace('/pages/invoice-registration/invoice-registration')
				this.$Router.back()
			},
			radioChange(evt) {
				for (let i = 0; i < this.supplierList.length; i++) {
					if (this.supplierList[i].code === evt.target.value) {
						this.current = i
						break
					}
				}
				this.supplierCode = this.supplierList[this.current].code
			},
			onConfirm() {
				if (!this.supplierCode) {
					uni.showToast({
						title: '请选择供应商',
						duration: 2000,
						icon: 'none',
					})
				} else {
					const supplier = this.supplierList.filter(
						(v) => v.code === this.supplierCode
					)[0]
					this.$Router.replace({
						path: '/pages/invoice-registration/invoice-registration',
						params: {
							customerNo: this.supplierCode,
							customerName: supplier.name,
						}
					})
				}
			},
			async getList() {
				const res = await request.post('/vrm/api/dd/selectData/list', {
					data: {
						type: 'CUST_INFO',
						queryParams: {
							auditStatus: '3',
							typeCode: '2',
							usingFlag: '1',
						},
					},
					funcModule: '入库通知新增',
					funcOperation: '查询',
				})
				this.supplierList = res.data
				this.supplierList.forEach((item) => {
					item.show = true
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.supplierPages {
		height: 100%;
		width: 100%;

		// background-color: #f5f5f5;
		.searchbar {
			margin: 10upx 30upx;
			// background-color: #f5f5f5;
		}

		.supplierContent {
			height: calc(100vh - 210upx);
			overflow: scroll;

			.supplier-item {
				background-color: #fff;
				border-bottom: 1px solid #eee;
				padding-left: 20upx;
				font-size: 24upx;
				line-height: 80upx;
				display: flex;

				.radioBox {
					text-align: center;
					width: 100upx;

					radio {
						transform: scale(0.8);
					}
				}

				.title {
					flex: 1;
				}
			}
		}
	}
</style>
