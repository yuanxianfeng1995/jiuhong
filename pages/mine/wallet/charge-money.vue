<template>
	<view class="contain">
		<view class="form">
			<view class="title">
				<text>请输入充值金额</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="integral" type="number"></u-input>
			</view>
		</view>
		<view class="warn">
			<text>规则说明</text>
		</view>
		<view class="sumbit">
			<u-button class="btn" type="default" @click="appPrePay()">确定并提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				integral: ''
			}
		},
		methods: {
			appPrePay: function() {
				console.log(this.integral)
				let that = this
				if (!that.integral || that.integral <= 0) {
					uni.showToast({
						title: '请正确填写金额',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '充值中',
					mask: true
				})
				this.$u.api.appPrePay({
					amount: that.integral,
				}).then(res => {
					if (res.code == 0) {
						let payData = res.data
						uni.requestPayment({
							"provider": "wxpay",
							"orderInfo": {
								"appid": payData.appId, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
								"noncestr": payData.nonceStr, // 随机字符串
								"package": "Sign=WXPay", // 固定值
								"partnerid": payData.partnerId, // 微信支付商户号
								"prepayid": payData.prepayId, // 统一下单订单号 
								"timestamp": payData.timeStamp, // 时间戳（单位：秒）
								"sign": payData.paySign // 签名，这里用的 MD5 签名
							},
							success(res) {
								uni.hideLoading()
								console.log('支付成功', res)
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							},
							fail(res) {
								uni.hideLoading()
								console.log('支付失败', res.errMsg)
								uni.showToast({
									title: '支付失败',
									icon: 'none'
								})
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style>
	.form {
		width: 680rpx;
		height: 294rpx;
		background: #ffffff;
		border-radius: 12rpx;
		margin: 30rpx auto;
		padding: 38rpx 34rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.title {
		font-size: 30rpx;
		color: #979797;
	}

	.input {
		display: flex;
		align-items: center;
	}

	.input text {
		font-size: 30rpx;
		color: #000000;
	}

	.input .line {
		font-size: 50rpx;
		color: #9c9c9c;
		font-weight: 300;
		padding-left: 16rpx;
		padding-right: 30rpx;
	}

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

	.warn {
		color: #9c9c9c;
		font-size: 28rpx;
		text-align: center;
	}
</style>
