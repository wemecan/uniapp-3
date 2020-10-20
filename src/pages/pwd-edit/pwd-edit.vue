<template>
	<view class="pwdPages">
		<qm-navbar title="密码修改" url='/pages/mine/index'></qm-navbar>
		<view class="pwd-list">
			<form @submit="formSubmit">
				<view class="pwd-list-item">
					<view class="lable">
						用户名
					</view>
					<view class="input">
						<input type="text" name='account' placeholder="用户名" placeholder-class="placeClass" />
					</view>
				</view>
				<view class="pwd-list-item pwd-pwd-item">
					<view class="lable">
						原密码
					</view>
					<view class="input">
						<input :type="!showPassword ? 'password':''" name="oldPassword" placeholder="请输入原密码" placeholder-class="placeClass" />
					</view>
					<view class="eyeicon" @click="showPassword=!showPassword">
						<uni-icons :type="showPassword ? 'eye':'eye-slash'"></uni-icons>
					</view>
				</view>
				<view class="pwd-list-item pwd-pwd-item">
					<view class="lable">
						新密码
					</view>
					<view class="input">
						<input :type="!showNewPassword ? 'password':'text'" name="newPassword" placeholder="请输入新密码" placeholder-class="placeClass" />
					</view>
					<view class="eyeicon" @click="showNewPassword = !showNewPassword">
						<uni-icons :type="showNewPassword ? 'eye':'eye-slash'"></uni-icons>
					</view>
				</view>
				<view class="pwd-list-item pwd-pwd-item">
					<view class="lable">
						确认密码
					</view>
					<view class="input">
						<input :type="!showFlag ? 'password':'text'" name="confirmPwd" placeholder="确认新密码" placeholder-class="placeClass" />
					</view>
					<view class="eyeicon" @click="showFlag = !showFlag">
						<uni-icons :type="showFlag ? 'eye':'eye-slash'"></uni-icons>
					</view>
				</view>

				<view class="pwd-button">
					<button form-type="submit">保存</button>
				</view>
			</form>

		</view>

	</view>
	</view>
</template>

<script>
	import md5 from 'md5-js'
	import CryptoJS from 'crypto-js'
	import request from "@/utils/request.js"
	import {
		Base64
	} from 'js-base64'
	export default {
		data() {
			return {
				showNewPassword: false,
				showPassword: false,
				showFlag: false,
				errorMsg: '',
				formdata: {
					account: '',
					oldPassword: "",
					newPassword: "",
					confirmPwd: "",
					errorMsg: "",
				}
			}
		},
		methods: {
			// 验证
			onBlur() {
				if (this.formdata.account.length <= 0) {
					this.errorMsg = "用户名不能为空！";
					this.presentToast(this.errorMsg);
					return false;
				} else if (
					this.formdata.newPassword.length <= 0 ||
					this.formdata.oldPassword.length <= 0 ||
					this.formdata.confirmPwd.length <= 0
				) {
					this.errorMsg = "密码不能为空！";
					this.presentToast(this.errorMsg);
					return false;
				} else if (this.formdata.confirmPwd !== this.formdata.newPassword) {
					this.errorMsg = "新密码与确认密码不符，请重新输入";
					this.presentToast(this.errorMsg);
					this.formdata.newPassword = "";
					this.formdata.confirmPwd = "";
					return false;
				}
				this.errorMsg = "";
				return true;
			},
			presentToast(msg) {
				uni.showToast({
					icon: 'none',
					title: msg,
					duration: 2000
				});
			},
			async formSubmit(e) {

				this.formdata = e.detail.value

				if (this.onBlur()) {
					// 加密的处理
					const random = CryptoJS.lib.WordArray.random(8).toString()
					const newPasswordO = this.aesEncrypt(this.formdata.newPassword, random)
					const res = await request.post(this.getUpdatePasswordUrl(), {
						data: {
							account: this.formdata.account,
							oldPassword: Base64.encode(md5(this.formdata.oldPassword)),
							newPassword: Base64.encode(md5(this.formdata.newPassword)),
							random: random,
							newPasswordO: newPasswordO,
						},
						funcModule: '用户密码',
						funcOperation: '修改'
					})
					if (res.status) {
						let msg = '修改成功,请重新登录'
						this.presentToast(msg)
						uni.clearStorageSync()
						this.$Router.replaceAll('/pages/login/index')
					} else {
						this.presentToast(res.msgText)
					}
				}
			},
			// 修改保存url
			getUpdatePasswordUrl() {
				const loginType = uni.getStorage('loginType')
				if (loginType === "plat") {
					return "/vrm/api/platform/cfgManager/updatePasswordWithOld";
				} else if (loginType === "group") {
					return "/vrm/api/platform/cfgTenant/updatePasswordWithOld";
				} else {
					return "/vrm/api/func/user/updatePasswordWithOld";
				}
			},
			aesEncrypt(word, keyStr) {
				const KEY = CryptoJS.enc.Utf8.parse("1234567890123456");
				let key = KEY;

				if (keyStr) {
					key = CryptoJS.enc.Utf8.parse(keyStr);
				}

				const srcs = CryptoJS.enc.Utf8.parse(word);
				var encrypted = CryptoJS.AES.encrypt(srcs, key, {
					iv: key,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.ZeroPadding
				});
				return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
			}
		}
	}
</script>

<style scoped lang="scss">
	.pwdPages {
		background-color: #f5f5f5;
		height: 100vh;

		.pwd-list {
			.pwd-list-item {
				background-color: #fff;
				height: 88upx;
				border-bottom: 2upx solid #e1e1e1;
				display: flex;
				line-height: 88upx;
				font-size: 28upx;
				padding-left: 30upx;

				.lable {
					width: 140upx;

				}

				.input {
					flex: 1;

					input {
						padding-left: 10upx;
						height: 100%;

					}

					.placeClass {
						font-size: 26upx;
					}
				}

				.eyeicon {
					width: 60upx;
					text-align: center;
				}
			}

			.pwd-pwd-item {
				padding-right: 30upx;
			}

			.pwd-button {
				margin: 80upx 30upx 0 30upx;

				button {
					color: #fff;
					border-radius: 50upx;
					background-color: #2484cf;
				}
			}
		}


	}
</style>
