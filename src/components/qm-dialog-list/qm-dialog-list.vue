<template>
	<view>
		<qm-navbar :title="title" :isShowBack='false' btnName='关闭' @myEvent='goBack()'></qm-navbar>
		<view class="confirmDetaile">
			<view class="confirmDetaile-card">
				<view class="confirmDetaile-title">
					{{list.title}}
				</view>
				<view class="confirmDetaile-con">

					<view class="confirmDetaile-item" v-for="(item,i) in list.formData" :key='i'>
						<view class="item-left">
							{{item.name}}
						</view>
						<view class="item-right" v-if="item.dict">
							{{queryParams[item.prop] | dataDictFormate(dictData(item.dict))}}
						</view>
						<view class="item-right" v-else-if="item.formate === 'date'">
							{{queryParams[item.prop] | dateFormate}}
						</view>
						<view class="item-right" v-else-if="item.formate === 'thousands'">
							{{queryParams[item.prop] | numFormate(item.precision)}}
						</view>
						<view class="item-right" v-else>
							{{queryParams[item.prop]}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fundfile from '@/static/js/fundfile'
	export default {
		data() {
			return {
				list: [],
				title: '',
			}
		},
		props: {
			queryParams: {},
			fileName: '',
		},

		mounted() {
			this.title = fundfile[this.fileName].title
			this.list = fundfile[this.fileName].mainInfo
		},
		methods: {
			// 获取指定字典数据
			dictData(query) {
				return this.$store.state.dictData && this.$store.state.dictData[query]
			},
			goBack() {
				this.$emit('hideClick')
			},
		},
	}
</script>

<style scoped lang="scss">
	.confirmDetaile {
		height: calc(100vh - 90upx);
		background-color: #f5f5f5;
		overflow: scroll;

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
						width: 335upx;
						text-align: right;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>
