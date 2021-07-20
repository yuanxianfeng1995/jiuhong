<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>请输入手机号</text>
				</view>
				<view class="sub_title">
					<text>Please enter your phone number. We will send you 6-digit code to verify your account.</text>
				</view>
			</view>
			<view class="form">
				<view class="tel">
					<text>+86</text>
					<input class="input" v-model="mobile" maxlength="11" type="number" placeholder="请输入手机号"
						@input="mobileChange" />
				</view>
			</view>
		</view>
		<view class="bottom">
			<button class="btn" @click="getCode">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
			}
		},
		methods: {
			//获取验证码
			getCode() {
				if (this.mobile.length != 11) {
					wx.showToast({
						title: '手机号输入错误',
						icon: 'none'
					})
					return
				}
				let that = this
				const app = getApp()
				let userInfo = app.globalData.userInfo || {
					"gender": 0,
					"city": "",
					"province": "",
					"country": "",
					"headimgurl": "",
					"openid": "oRrdQt6Tau75ETteYhNJz5-m1qO4",
					"nickname": "旋风",
					"avatarurl": "",
					"unionid": "oU5Yyt4oGlJqTXaVpmhXo21nGWuk",
					"id": 4,
					"userNo": this.mobile,
					"username": null,
					"realname": null,
					"headPortrait": "",
					"unionId": "oU5Yyt4oGlJqTXaVpmhXo21nGWuk",
					"password": null,
					"tradepwd": null,
					"status": 1,
					"mobile": this.mobile,
					"regtime": null,
					"iscase": 1,
					"isreal": null,
					"logintime": null,
					"loginIp": "43.250.201.119"
				}

				that.$u.api.wxLogin({
					headPortrait: userInfo.headimgurl,
					mobile: this.mobile,
					nickname: userInfo.nickname,
					unionId: userInfo.unionid,
				}).then(res => {
					if (res.code === 0) {
						app.globalData.userInfo = {
							...userInfo,
							...res.data
						};
						console.log('res.data',res.data)
						// uni.navigateTo({
						// 	url:`/pages/login/password/password?mobile=${this.mobile||''}&smscode=${''}&password=${''}`
						// })
						uni.navigateTo({
							url: `/pages/login/code/code?mobile=${this.mobile||''}&smscode=${''}&password=${''}`
						})

					} else {
						that.$u.toast(res.msg);
					}
				})

			},
			//手机号输入
			mobileChange: function(e) {
				this.mobile = e.target.value
			}
		}
	}
</script>

<style>
	.contain {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: space-between;
		height: 100vh;
	}

	.title {
		font-size: 50rpx;
		font-weight: 400;
		text-align: center;
		color: #532da3;
		padding-top: 260rpx;
	}

	.sub_title {
		opacity: 0.8;
		font-size: 30rpx;
		font-weight: 400;
		text-align: center;
		color: rgba(28, 25, 57, 0.80);
		line-height: 50rpx;
		padding: 66rpx 36rpx 126rpx;
	}

	.tel {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 90rpx 24rpx;
	}

	.tel text {
		border-right: 2rpx solid #8A959A;
		padding-right: 33rpx;
		color: #000;
		font-weight: bold;
	}

	.tel .input {
		flex: 1;
		padding-left: 33rpx;
		color: #000;
		font-weight: bold;
	}

	.bottom {
		flex: 1;
		background-color: #f9f9f9;
		padding: 0 36rpx 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.bottom .btn {
		width: 680rpx;
		height: 120rpx;
		line-height: 120rpx;
		color: #FFFFFF;
		background: #532da3;
	}
</style>
