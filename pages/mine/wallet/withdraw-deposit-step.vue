<template>
	<view class="contain">
		<view class="pay_name">
			<view class="pay_item">
				<u-input v-model="mobile" maxlength="11" placeholder="请输入当前账号手机号"></u-input>
			</view>
			<view class="pay_item">
				<u-input v-model="code" maxlength="6" placeholder="请输入验证码"></u-input>
				<u-toast ref="uToast"></u-toast>
				<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange">
				</u-verification-code>
				<text @tap="getCode">{{tips}}</text>
			</view>
		</view>
		<view class="sumbit">
			<button class="btn" type="default" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				code:'',
				tips: '',
				// refCode: null,
				seconds: 60,
				form:{},
				userInfoMobile:''
			}
		},
		onLoad(option) {
			//获取登陆用户信息 - 手机号
			this.userInfoMobile = uni.getStorageSync('user').user.mobile;
			console.log(this.userInfoMobile)
			
			console.log(JSON.parse(option.form))
			this.form = JSON.parse(option.form)
			console.log(this.form)
		},
		methods: {
			submit: function() {
				if( !this.mobile || this.mobile.length != 11 ){
					this.$u.toast('请检查手机号');
					return
				}
				if( this.userInfoMobile != this.mobile ){
					this.$u.toast('需为当前登陆手机号');
					return
				}
				if( !this.code || this.code.length != 6 ){
					this.$u.toast('请检查验证码');
					return
				}
				this.codeChangeInput()
			},
			//验证码
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if( this.userInfoMobile != this.mobile ){
					this.$u.toast('需为当前登陆手机号');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					let that = this
					this.$u.api.get_smsLogin({
						mobile:that.mobile,
						// mobile:'18798808568',
						method:2,
					}).then(res => {
						console.log(res);
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
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			//接口 - 验证码 - 登录验证
			codeChangeInput(){
				let that = this
				let userInfo = getApp().globalData.userInfo
				userInfo.mobile = this.mobile
				userInfo.smscode = this.code
				uni.showLoading({
					title:'提现中',
					mask: true
				})
				this.$u.api.login(userInfo).then(res => {
					if( res.code == 200 ){
						that.$u.api.cashMoney( that.form ).then(res => {
							if( res.code == 200 ){
								uni.hideLoading()
								uni.showToast({
									title:'提现成功'
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta:2
									})
								},1000)
							}else{
								uni.hideLoading()
								this.$u.toast(res.msg);
							}
						})
					}else{
						this.$u.toast('验证码错误');
					}
				})
			},
		}
	}
</script>

<style>
	.sumbit {
		position: fixed;
		left: 35rpx;
		bottom: 20rpx;
	}

	.sumbit .btn {
		width: 680rpx;
		height: 120rpx;
		background: #532da3;
		border-radius: 20rpx;
		color: #FFFFFF;
		line-height: 120rpx;
	}

	.pay_name {
		width: 680rpx;
		margin: 24rpx auto;
	}

	.pay_item {
		background-color: #FFFFFF;
		height: 98rpx;
		padding: 0 34rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.pay_item input {
		color: #8f8f8f;
		font-size: 28rpx;
	}
</style>
