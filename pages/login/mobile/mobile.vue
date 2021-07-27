<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>登录</text>
				</view>
				<view class="sub_title">
				</view>
			</view>
			<view class="form">
				<view class="tel">
					<text>+86</text>
					<input class="input" v-model="mobile" maxlength="11" type="number" placeholder="请输入手机号"
						@input="mobileChange" />
				</view>
				<view class="tel">
					<text>密码</text>
					<input class="input" v-model="password" maxlength="11" type="password" placeholder="请输入密码" />
				</view>
			</view>
		</view>
		<view class="bottom">
			<!-- <button class="btn" @click="prev">上一步</button> -->
			<button class="btn" @click="register">完成</button>
			<text class="forget-password" @click="forgetPassword">忘记密码</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				password: ''
			}
		},
		methods: {
			forgetPassword(){
				uni.navigateTo({
					url: '/pages/login/verification/verification?mobile='+(this.mobile || '')
				})
			},
			//手机号输入
			mobileChange: function(e) {
				this.mobile = e.target.value
			},
			register() {
				const that=this;
				if (that.password.length < 6) {
					wx.showToast({
						title: '密码输入最少六位',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '登录中'
				})
				const app = getApp()
				let userInfo = app.globalData.userInfo

				that.$u.api.wxLogin({
					headPortrait: userInfo.headimgurl,
					mobile: that.mobile,
					nickname: userInfo.nickname,
					unionId: userInfo.unionid,
				}).then(res => {
					if (res.code === 0) {
						that.$u.api.pwdLogin({
							"mobile": that.mobile,
							"password": that.password,
						}).then(res1 => {
							try {
								console.log('登录成功', res1)
								if (res1.code == 0) {
									app.globalData.userInfo = {
										...userInfo,
										...res1.data
									};
									
									uni.setStorageSync('token', res1.data.token)
									wx.showToast({
										title: '登录成功',
										success() {
											console.log('登录成功switchTab')
											uni.reLaunch({
												url: '/pages/index/index'
											})
										}
									})
									uni.hideLoading()

								} else {
									wx.showToast({
										title: res1.msg,
										icon: 'none'
									})
								}
							} catch (e) {
								console.log(e)
							}

						})
					}
				})
			},
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
		margin-bottom: 40rpx;
	}

	.tel text {
		border-right: 2rpx solid #8A959A;
		padding-right: 33rpx;
		color: #000;
		width: 100rpx;
		font-weight: bold;
	}

	.tel .input {
		flex: 1;
		padding-left: 33rpx;
		color: #000;
		font-weight: bold;
	}

	.bottom {
		background-color: #f9f9f9;
		padding: 0 36rpx 120rpx;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		position: relative;
	}
	
	.bottom .btn {
		width: 60%;
		height: 80rpx;
		line-height: 80rpx;
		color: #FFFFFF;
		background: #532da3;
		
	}
</style>
