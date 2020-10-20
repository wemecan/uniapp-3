<template>
	<view class="login-wrapper">
		<view class="login-title">
			<view class="logo">
				<img src="static/img/login/startup-logo.png">
			</view>
			<h4>
				CTRM<uni-text>V5.0</uni-text>
			</h4>
		</view>
		<view class="login-form">
			<view class="uni-form-item uni-column">
				<view class="title">企业名</view>
				<input class="uni-input" v-model="enterpriseName" placeholder="请输入企业名" placeholder-style="color: #80c6e7;" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">用户名</view>
				<input class="uni-input" v-model="account" placeholder="请输入用户名" placeholder-style="color: #80c6e7;" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">密&nbsp;&nbsp;&nbsp;码</view>
				<input class="uni-input" v-model="password" password placeholder="请输入密码" placeholder-style="color: #80c6e7;" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">验证码</view>
				<view class='yzm'>
					<input class="uni-input" v-model="captcha" placeholder="请输入验证码" placeholder-style="color: #80c6e7;" @confirm="login" />
					<img :src="captchaSrc" @click="loadCaptcha" />
				</view>
			</view>
			<view class="uni-btn-v">
				<button @click="login">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from 'md5-js'
	import {
		Base64
	} from 'js-base64'
	import request from "@/utils/request"

	export default {
		data() {
			return {
				enterpriseName: uni.getStorageSync('enterpriseName') || '启明',
				account: uni.getStorageSync('account') || 'admin',
				password: '',
				captcha: '',
				captchaToken: '',
				captchaSrc: ''
			}
		},
		mounted() {
			this.loadCaptcha()
		},
		methods: {
			async login() {
				if (this.enterpriseName.length <= 0) {
					uni.showToast({
						title: '请输入企业名',
						duration: 2000,
						icon: 'none'
					})
				} else if (this.account.length <= 0) {
					uni.showToast({
						title: '请输入用户名',
						duration: 2000,
						icon: 'none'
					})
				} else if (this.password.length <= 0) {
					uni.showToast({
						title: '请输入密码',
						duration: 2000,
						icon: 'none'
					})
				} else if (this.captcha.length <= 0) {
					uni.showToast({
						title: '请输入验证码',
						duration: 2000,
						icon: 'none'
					})
				} else {
					const {
						enterpriseName,
						account,
						password,
						captcha,
						captchaToken
					} = this
					// 登录接口请求
					const result = await request.post('/vrm/api/user/login', {
						data: {
							account,
							password: Base64.encode(md5(password)),
							captcha,
							enterpriseName,
							captchaToken,
							terminal: 'WAP'
						},
						funcModule: '登录页面',
						funcOperation: '登录'
					})
					if (result.status) {
						// 本地永久储存信息
						uni.setStorageSync('TokenKey', result.data.accessToken)
						uni.setStorageSync('Md5Key', result.data.md5Token)
						uni.setStorageSync('enterpriseName', this.enterpriseName)
						uni.setStorageSync('account', this.account)
						if (result.data.refreshToken) {
							uni.setStorageSync('RefreshTokenKey', result.data.refreshToken)
						}
					} else {
						uni.showToast({
							title: result.msgText,
							duration: 1000,
							icon: 'none'
						})
						setTimeout(() => {
							this.loadCaptcha()
						}, 1000)
						return false
					}

					const employee = await request.post('/vrm/api/func/employee/info', {
						data: 'info',
						funcModule: '登录页面',
						funcOperation: '查询'
					})

					// #ifdef APP-PLUS
					if (employee.status) {
						const jyJPush = uni.requireNativePlugin('JY-JPush')
						setTimeout(() => {
							jyJPush.setJYJPushAlias({
								userAlias: employee.data.code
							}, result => {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: JSON.stringify(result)
								// })
							})
						}, 5000)
					}
					// #endif 

					this.$Router.replaceAll('/pages/work/index')
				}
			},
			loadCaptcha() {
				request.post('/vrm/captcha', {}, result => {
					if (result.status) {
						this.captchaSrc = 'data:image/jpeg;base64,' + result.data.img
						this.captchaToken = result.data.token
					}
				})
			}
		}
	}
</script>

<style scoped lang='scss'>
	.login-wrapper {
		width: 100%;
		height: 100vh;
		padding: 0 40upx;
		box-sizing: border-box;
		background: url('../../static/img/login/login-bg.png') no-repeat center;
		background-size: cover;
		overflow: hidden;

		.login-title {
			margin: 0 auto;
			margin-top: 200upx;
			text-align: center;

			.logo {
				height: 160upx;

				img {
					width: 140upx;
				}
			}

			h4 {
				font-weight: 500;
				color: #ffffff;
				font-size: 42upx;
				margin-bottom: 20upx;
				text-shadow: 0 2upx 8upx #0a5794;

				uni-text {
					font-size: 28upx;
					margin-left: 10upx;
				}
			}
		}

		.login-form {
			color: #ffffff;

			.uni-form-item {
				display: flex;
				border-bottom: 2upx solid #76bfe4;

				.title {
					width: 20%;
					font-size: 32upx;
					padding: 30upx 0 10upx;
				}

				.uni-input {
					width: 80%;
					padding: 30upx 0 10upx;

					.uni-input-wrapper {
						width: 70%;
					}
				}
			}

			.yzm {
				width: 70%;
				display: flex;
				justify-content: space-between;

				.uni-input {
					width: 60%;
				}

				img {
					width: 40%;
					margin: 10upx 0;
				}
			}

			.uni-btn-v {
				margin-top: 50upx;

				uni-button {
					border-radius: 50upx;
					background-color: #2484cf;
					color: #ffffff;
				}
			}
		}
	}
</style>
