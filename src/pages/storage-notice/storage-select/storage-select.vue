<template>
	<view class="warehouse-pages">
		<qm-navbar title="仓库选择" :event="goBack" btnName='确定' @myEvent='onConfirm'></qm-navbar>
		<uni-search-bar @confirm="search" :radius="100" class="searchbar" />
		<view class="warehouse-content">
			<radio-group @change="radioChange">
				<label class="warehouse-item" v-for="(item, index) in warehouseList" :key="item.code">
					<view class="title">{{item.name}}</view>
					<view class="radio">
						<radio :value="item.code" :checked="index === current" />
					</view>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				current: '',
				warehouseCode: '',
				warehouseName: '',
				warehouseList: []
			}
		},
		onLoad() {
			this.warehouseCode = this.$Route.query.warehouseCode
			this.warehouseName = this.$Route.query.warehouseName
			this.getList()
		},
		methods: {
			async getList() {
				const res = await request.post('/vrm/api/dd/selectData/list', {
					data: {
						type: "DD_WAREHOUSE"
					},
					funcModule: '入库通知新增',
					funcOperation: '查询',
				})
				this.warehouseList = res.data
				this.warehouseList.forEach((item) => {
					item.show = true
				})
				this.warehouseList.forEach((item, index) => {
					if (item.code === this.$Route.query.warehouseCode) {
						this.current = index
					}
				})
			},
			radioChange(evt) {
				for (let i = 0; i < this.warehouseList.length; i++) {
					if (this.warehouseList[i].code === evt.target.value) {
						this.current = i;
						break;
					}
				}
				this.warehouseCode = this.warehouseList[this.current].code
				this.warehouseName = this.warehouseList[this.current].name
			},
			onConfirm() {
				if (!this.warehouseCode) {
					uni.showToast({
						title: '请选择仓库信息',
						duration: 2000,
						icon: 'none'
					});
				} else {
					const params = {
						warehouseCode: this.warehouseCode,
						warehouseName: this.warehouseName
					}
					this.$Router.push({
						path: '/pages/storage-notice/storage-notice',
						params: Object.assign({}, this.$Route.query, params)
					})
				}
			},
			goBack() {
				this.$Router.push({
					path: '/pages/storage-notice/storage-notice',
					params: this.$Route.query
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.warehouse-pages {
		height: 100%;
		width: 100%;

		.searchbar {
			margin: 10upx 30upx;
		}

		.warehouse-content {
			height: calc(100vh - 210upx);
			overflow: scroll;

			.warehouse-item {
				background-color: #fff;
				border-bottom: 1px solid #eee;
				padding-left: 20upx;
				font-size: 24upx;
				line-height: 80upx;
				display: flex;

				.radio {
					text-align: center;
					width: 100upx;

					radio {
						transform: scale(0.8)
					}
				}

				.title {
					flex: 1;
				}
			}
		}

	}
</style>
