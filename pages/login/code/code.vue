<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>请输入验证码</text>
				</view>
				<view class="sub_title">
					<text>Please enter your message code.</text>
				</view>
			</view>
			<view class="form">
				<view class="code">
					<u-message-input mode="box" :maxlength="6" @finish="codeChangeInput"></u-message-input>
				</view>
			</view>
		</view>
		<view class="bottom">
			<u-toast ref="uToast"></u-toast>
			<u-verification-code @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
			<button class="btn" @click="getCode">{{tips}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tips: '',
				mobile:'',
			}
		},
		onLoad(option) {
			console.log('mobile',option.mobile)
			this.mobile = option.mobile
		},
		onReady() {
			this.getCode()
		},
		methods: {
			//倒计时改变
			codeChange(text) {
				// console.log(text)
				this.tips = text;
			},
			//获取验证码
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					// 向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					let that = this
					this.$u.api.get_smsLogin({
						mobile:that.mobile,
						// mobile:'18798808568', 
						method:2,
					}).then(res => {
						console.log('验证码',res);
						if( res.code == 200 ){
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}else{
							this.$u.toast(res.msg);
						}
					})
				} else {
					this.$u.toast('请倒计时结束后再获取');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				this.$u.toast('验证码获取成功');
			},
			//验证码
			codeChangeInput(value){
				console.log(value)
				let that = this
				let userInfo = getApp().globalData.userInfo
				userInfo.mobile = this.mobile
				userInfo.smscode = value
				this.$u.api.login(userInfo).then(res => {
					console.log(res);
					if( res.code == 200 ){
						console.log(res)
						uni.setStorageSync('token', res.data);
						uni.showLoading({
							title:'登录中'
						})
						setTimeout(()=>{
							uni.hideLoading()
							wx.showToast({
								title:'登录成功',
								success() {
									uni.reLaunch({
										url:'../../index/index'
									})
								}
							})
						},2000)
					}else{
						wx.showToast({
							title:res.msg,
							icon:'none'
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

	.code {
		padding-bottom: 24rpx;
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
