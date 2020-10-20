<template>
	<view>
		<qm-navbar title="待办事项"></qm-navbar>
		<qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
			<view slot="drawer" class="drawer-item">
				<view class="label">
					开始时间
				</view>
				<view>
					<picker mode="date" class="item-input" v-model="startDate" @change="bindStartDateChange">
						<view class="uni-input">{{ startDate }}</view>
					</picker>
				</view>
				<view class="label">
					结束时间
				</view>
				<view>
					<picker mode="date" class="item-input" v-model="endDate" @change="bindEndDateChange">
						<view class="uni-input">{{ endDate }}</view>
					</picker>
				</view>
				<view class="uni-btn-v">
					<button type="default" size="mini" class="reset" @click="onReset">重置</button>
					<button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
				</view>
			</view>
		</qm-filters>

		<view class="list">
			<view v-for="item in listExt" :key="item.id">
				<view class="item" v-if="activeBussinessIndex === '全部' ? true : item.moduleName === activeBussinessIndex">
					<view class="header">
						<uni-text class="icon">{{ item.moduleName[0] }}</uni-text>
						<uni-text class="name">{{ item.moduleName }}</uni-text>
						<uni-text class="time">{{ item.startTime.slice(0, 10) }}</uni-text>
					</view>
					<view class="content">
						<view>{{ item.todoThat }}&nbsp;待处理</view>
						<view>提交人:{{ item.submitter }}</view>
						<view class="btn">
							<button type="warn" size="mini" @click="todo(item)">处理</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request"

	export default {
		data() {
			return {
				startDate: '',
				endDate: '',
				activeBussinessIndex: '全部',
				array: ['全部'],
				listExt: []
			}
		},
		onPullDownRefresh() {
			this.getList()
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				request.post('/vrm/api/bpm/backlog/listExtWithReceive', {
					camelToUnderlineFlg: false,
					current: 1,
					data: {
						toDoDateStart: this.formate(this.startDate),
						toDoDateEnd: this.formate(this.endDate)
					},
					funcModule: "待办事项",
					funcOperation: "查询",
					isPage: true,
					size: 20,
					sortString: "startTime.desc"
				}).then(res => {
					this.listExt = res.data
					this.listExt.forEach(item => {
						if (item.moduleName && !this.array.includes(item.moduleName)) this.array.push(item.moduleName)
					})
					setTimeout(() => {
						uni.stopPullDownRefresh()
					}, 500)
				})
			},
			todo(data) {
				if (data.taskStatusType === '1') {
					request.post('/vrm/api/bpm/task/claimTask', {
						funcModule: data.businessName,
						funcOperation: '认领',
						data: {
							assignee: '', // 当前账号
							taskId: data.id // 任务ID
						}
					}).then(response => {
						uni.showToast({
							title: response.status ? "认领任务成功" : response.msgText,
							icon: response.status ? "success" : "none",
							duration: 2000,
							success() {
								if (response.status) {
									this.$Router.push({
										path: '/pages/approval/index',
										query: {
											queryParams: data
										}
									})
								}
							}
						})
					})
				} else {
					data.opType = 'edit'
					this.$Router.push({
						path: '/pages/approval/index',
						query: {
							queryParams: data
						}
					})
				}
			},
			onChangeLeft(val) {
				this.activeBussinessIndex = this.array[val]
			},
			bindStartDateChange(e) {
				this.startDate = e.target.value
			},
			bindEndDateChange(e) {
				this.endDate = e.target.value
			},
			getDate(type) {
				const date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()

				if (type === 'start') {
					year = year
				} else if (type === 'end') {
					year = year
				}
				month = month > 9 ? month : '0' + month
				day = day > 9 ? day : '0' + day
				return `${year}-${month}-${day}`
			},
			formate(date) {
				if (date.length === 10) {
					return date.replace(/\-/g, '')
				}
			},
			onReset() {
				this.startDate = ''
				this.endDate = ''
			},
			onConfirm() {
				this.$refs.filter.closeDrawer()
				this.getList()
			}
		}
	}
</script>

<style scoped lang='scss'>
	.list {
		height: calc(100vh - 190upx);
		padding: 0.1px 30upx 20upx;
		background-color: #ededed;
		overflow-y: auto;

		.item {
			border: 2upx solid #e1e1e1;
			background-color: #ffffff;
			margin-top: 20upx;

			.header {
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				padding: 0 20upx;
				border-bottom: 2upx solid #e1e1e1;
				background-color: #f8f7f7;
				box-sizing: border-box;

				uni-text {
					vertical-align: top;
					font-size: 30upx;
				}

				.icon {
					width: 40upx;
					height: 40upx;
					line-height: 40upx;
					text-align: center;
					border-radius: 50%;
					background-color: #3880ff;
					color: #ffffff;
					margin: 20upx 10upx 0 0;
					font-size: 24upx;
				}

				.time {
					float: right;
					color: rgb(152, 154, 162);
					font-size: 24upx;
				}
			}

			.content {
				padding: 20upx;

				uni-view {
					color: rgb(102, 102, 102);
					font-size: 28upx;
					line-height: 50upx;
				}

				.btn {
					text-align: right;

					uni-button {
						margin-top: 10upx;
					}
				}
			}
		}
	}

	.drawer-item {
		
		.label {
			text-align: left;
		}

		.item-input {
			height: 76upx;
			background-color: #f9f9f9;
		}
	}

	.uni-btn-v {
		position: absolute;
		bottom: 10upx;
		left: 30upx;
		right: 30upx;

		uni-button {
			float: left;
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
