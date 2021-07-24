<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>请输入密码</text>
				</view>
			</view>
			<view class="form">
				<view class="tel">
					<text>密码</text>
					<input class="input" v-model="password" maxlength="11" type="password" placeholder="请输入密码"/>
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
				password: '',
				mobile: '',
				smscode: '',
			}
		},
		onLoad(option) {
			console.log('mobile', option.mobile)
			this.mobile = option.mobile || '';
			this.password = option.password || '';
			this.smscode = option.smscode || ''
			
		},
		methods: {
			forgetPassword(){
				uni.navigateTo({
					url: '/pages/login/verification/verification?mobile='+(this.mobile || '')
				})
			},
			prev() {
				uni.navigateTo({
					url: '../code/code?mobile='+(this.mobile || '')
				})
			},
			register() {
				if (this.password.length<6) {
					wx.showToast({
						title: '密码输入最少六位',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '登录中'
				})
				let userInfo = getApp().globalData.userInfo
				console.log('userInfo', userInfo)
				this.$u.api.regist({
					"code": this.code,
					"mobile": this.mobile,
					"password": this.password,
					"tempUserId": userInfo.tempUserId || 0,
					"tradepwd": userInfo.tradepwd,
				}).then(res => {
					try{
						console.log('登录成功',res)
						if (res.code == 0) {
							uni.setStorageSync('token', userInfo.token)
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
								title: res.msg,
								icon: 'none'
							})
						}
					}catch(e){
						console.log(e)
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
		margin-bottom: 80rpx;
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
	.forget-password{
		position: absolute;
		right: 30rpx;
		top: 45rpx;
	}
</style>
