<template>
	<view class="myPages">
		<qm-navbar title="我的" :isShowBack="false"></qm-navbar>

		<view class="myPages-content">
			<view class="my_list">
				<view class="myPicture">
					<image src="/static/img/mine/header.jpg"></image>
				</view>
				<view class="person-head-box">
					<view class="person-head-nickname">{{ userList.account }}-{{ userList.name }}</view>
					<view class="person-head-username">{{ userList.timeNow }}</view>
				</view>
				<view class="person-right-icon">
					<uni-icons type="arrowright" color="#2484cf" @click="editClick"></uni-icons>
				</view>
			</view>

			<view class="personList">
				<view class="person">
					<view class="person-list-item" style="margin-bottom: 20upx; border-top: 2upx solid #f5f5f5;" @click="goPwd()">
						<uni-icons type="locked" color="#2484cf" class="title_img"></uni-icons>
						<view class="list-item-title">
							密码修改
						</view>
						<view class="arrow">
							<uni-icons type="arrowright" color="#999"></uni-icons>
						</view>
					</view>
					<view class="person-list-item" style="border-top: 2upx solid #f5f5f5;">
						<uni-icons type="info" color="#2484cf" class="title_img"></uni-icons>
						<view class="list-item-title">
							关于CTRM
						</view>
						<view class="arrow">
							<uni-icons type="arrowright" color="#999"></uni-icons>
						</view>
					</view>
					<view class="person-list-item">
						<uni-icons type="help" color="#ff0000" class="title_img"></uni-icons>
						<view class="list-item-title">
							帮助中心
						</view>
						<view class="arrow">
							<uni-icons type="arrowright" color="#999"></uni-icons>
						</view>
					</view>
					<view class="person-list-item">
						<uni-icons type="chatboxes" color="#00aaff" class="title_img"></uni-icons>
						<view class="list-item-title">
							多语言
						</view>
						<view class="arrow">
							<uni-icons type="arrowright" color="#999"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<button type="default" @click="logout">退出登录</button>
		</view>

		<qm-tabs name="我"></qm-tabs>
	</view>
</template>

<script>
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				userList: []
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			goPwd() {
				this.$Router.push('/pages/pwd-edit/pwd-edit')
			},
			editClick() {
				this.$Router.push({
					path: '/pages/personal-info/personal-info',
					query: {
						userInfo: this.userList
					}
				})
			},
			async getList() {
				const res = await request.post('/vrm/api/user', {
					data: "0",
					funcModule: "登录",
					funcOperation: "查询"
				})
				if (res.status) {
					this.userList = res.data
				}
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确认退出登录？',
					success: res => {
						if (res.confirm) {
							uni.removeStorageSync('TokenKey')
							uni.removeStorageSync('Md5Key')
							uni.removeStorageSync('RefreshTokenKey')
							this.$Router.replaceAll('/pages/login/index')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	uni-page-body {
		height: 100%;
	}

	.myPages {
		background: #f5f5f5;
		height: 100vh;
	}

	.my_list {
		display: flex;
		background-color: #fff;
		margin: 20upx 0upx;
		padding: 60upx 30upx;
		height: 86upx;
		margin-bottom: 20upx;

		.myPicture {
			width: 90upx;
			height: 90upx;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 88upx;
				height: 88upx;
				margin-right: 20rpx;
			}

		}

		.person-head-box {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			margin-left: 20upx;
			color: #333;
			font-weight: 500;
		}

		.person-head-nickname {
			font-size: 30upx;
		}

		.person-head-username {
			font-size: 26upx;
			color: #999;
		}

		.person-right-icon {
			text-align: right;
			line-height: 80upx;

			image {
				width: 28upx;
				height: 28upx;

			}
		}
	}

	.personList {
		.person {
			.person-list-item {
				border-bottom: 2upx solid #f5f5f5;
				background-color: #fff;
				line-height: 86upx;
				display: flex;
				font-size: 28upx;
				padding-right: 30upx;

				.title_img {
					padding-right: 30upx;
					padding-left: 30upx;
				}

				.list-item-title {
					flex: 1;
					color: #666;
				}

				.arrow {
					text-align: right;
					width: 60upx;

				}

			}
		}


	}

	.myPages-content {
		button {
			height: 100upx;
			background-color: #fff;
			margin-top: 80upx;
			font-size: 32upx;
			line-height: 100upx;
			border-radius: 0;
		}

		button:after {
			border: 0;
			border-radius: 0;
		}
	}
</style>
