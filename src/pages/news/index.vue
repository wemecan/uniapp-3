<template>
	<view>
		<qm-navbar title="消息" :isShowBack="false "></qm-navbar>
		<qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
			<view slot="drawer">
				<view class="drawer-item">
					<view class="item-lable">
						开始时间
					</view>
					<picker mode="date" class="item-input" v-model="formData.sendDateFrom" @change="bindStartDateChange">
						<view class="uni-input">{{ formData.sendDateFrom }}</view>
					</picker>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						结束时间
					</view>
					<picker mode="date" class="item-input" v-model="formData.sendDateTo" @change="bindEndDateChange">
						<view class="uni-input">{{ formData.sendDateTo }}</view>
					</picker>
				</view>

				<view class="drawer-item">
					<view class="item-lable">
						消息级别
					</view>
					<view class="msg">
						<view v-for="(item,i) in msgClassTypeList" :key='item.key' @click="spanClick(item.value)" :class="['msg-select', { 'msg-select-active': item.key === isSelect }]">
							{{item.label}}
						</view>
					</view>
				</view>
				<view class="drawer-item">
					<view class="item-lable">
						消息标题
					</view>
					<view class="item-input">
						<input type="text" value="" v-model="formData.msgTitle" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
					</view>
				</view>
				<view class="uni-btn-v">
					<button type="default" size="mini" class="reset">重置</button>
					<button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
				</view>
			</view>

		</qm-filters>
		<scroll-view scroll-y="true" class="new_list" lower-threshold='50' @scrolltolower="lower">
			<view>
				<view class="new_list-ul" v-for="(item,i) in newsLists" :key="i">
					<view class="new_list-item" @click="onDetail(item)">
						<view class="item-img">
							<image :src="item.img" mode=""></image>
						</view>
						<view class="item-content">
							<view class="item-content-title">
								{{item.msgTitle.indexOf(':')===-1?item.msgTitle:item.msgTitle.slice(0,item.msgTitle.indexOf(':'))}}
							</view>
							<view class="item-content-right">
								{{item.userSendDt.slice(0,10)}}
							</view>
							<view class="item-arrow">
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!hasMore" class="more">
					---------- 没有更多了 -----------
				</view>
			</view>
		</scroll-view>
		<qm-tabs name="消息"></qm-tabs>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				array: ['全部', '已读', '未读'],
				newsLists: [],
				isSelect: '',
				current: 1,
				hasMore: true,
				containerHeight: '',
				innerHeight: '',
				formData: {
					msgTitle: "",
					readFlag: "",
					msgClassType: "",
					sendDateFrom: "",
					sendDateTo: "",
					msgTaskNo: ""
				},
			}
		},
		computed: {
			msgClassTypeList() {
				return this.$store.state.dictData.msgClassType
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			onConfirm() {
				this.$refs.filter.closeDrawer()
				this.current = 1
				this.hasMore = true
				this.newsLists = []
				this.getList()
			},
			spanClick(e) {
				this.isSelect = e;
				this.formData.msgClassType = e;
			},
			onChangeLeft(val) {
				this.formData.readFlag = val === 1 ? '1' : val === 2 ? '0' : ''
				this.current = 1
				this.hasMore = true
				this.newsLists = []
				this.getList()
			},
			bindStartDateChange(e) {
				this.formData.sendDateFrom = e.target.value
			},
			bindEndDateChange(e) {
				this.formData.sendDateTo = e.target.value
			},
			formate(date) {
				if (date.length === 10) {
					return date.replace(/\-/g, '')
				}
			},
			async getList() {
				const res = await request.post('/vrm/api/msg/my/list', {
					current: this.current,
					data: {
						msgTaskNo: "",
						readFlag: this.formData.readFlag,
						msgTitle: this.formData.msgTitle,
						sendDateFrom: this.formate(this.formData.sendDateFrom),
						sendDateTo: this.formate(this.formData.sendDateTo),
						msgClassType: this.formData.msgClassType
					},
					funcModule: "我的消息",
					funcOperation: "查询",
					isPage: true,
					size: 20,
					sortString: "userSendDt.desc"
				})

				this.newsLists = [...this.newsLists, ...res.data]
				this.newsLists.forEach((item) => {
					item.img = this.setImg(item.msgClassType)
				})
				if (res.data.length < 20) {
					this.hasMore = !this.hasMore
					return
				}

			},
			setImg(i) {
				switch (i) {
					case '3':
						return '/static/img/news/newpic1@2x.png'
					case '1':
						return '/static/img/news/newpic2@2x.png'
					case '2':
						return '/static/img/news/newpic3@2x.png'
				}
			},
			lower() {
				if (this.hasMore) {
					this.current += 1
					this.getList()
				}

			},
			onDetail(data) {
				uni.setStorageSync('newsList', data)
				this.$Router.push('/pages/news-details/news-details')
			}
		}
	}
</script>

<style scoped lang="scss">
	.new_list {
		height: calc(100vh - 270upx);
		background: #f5f5f5;

		.new_list-ul {
			background-color: #fff;

			.new_list-item {
				height: 100upx;
				line-height: 100upx;
				display: flex;
				padding-left: 30upx;

				.item-img {
					width: 80upx;
					height: 80upx;
					line-height: 140upx;
					text-align: center;
					margin: 12upx 20upx 0 0;

					image {
						display: block;
						width: 76upx;
						height: 76upx;
					}
				}

				.item-content {
					flex: 1;
					font-size: 28upx;
					border-bottom: 2upx solid #f5f5f5;
					padding-right: 10upx;

					.item-content-title {
						float: left;
						width: 400upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #333;
					}

					.item-content-right {
						float: left;
						font-size: 24upx;
						width: 160upx;
						text-align: right;
						color: #999999;
					}

					.item-arrow {
						float: right;
						width: 32upx;
					}
				}
			}
		}
	}

	.more {
		text-align: center;
		font-size: 24upx;
		color: #999;
		margin: 20upx 0;
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
