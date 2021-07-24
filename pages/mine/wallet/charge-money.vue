<template>
	<view class="contain">
		<view class="form">
			<view class="title">
				<text>请输入充值金额</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="integral"></u-input>
			</view>
		</view>
		<view class="warn">
			<text>规则说明</text>
		</view>
		<view class="sumbit">
			<button class="btn" type="default" @click="appPrePay()">确定并提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				integral:''
			}
		},
		methods: {
			appPrePay:function(){
				console.log(this.integral)
				let that = this
				if( !that.integral || that.integral  <= 0 ){
					uni.showToast({
						title:'请正确填写金额',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title:'充值中',
					mask: true
				})
				this.$u.api.appPrePay({
					amount:that.integral,
				}).then(res => { 
					console.log('啊啊啊', res )
					if( res.code == 0 ){
						let payData = res.data
						console.log('啊啊啊', res.data)
						// "appId": "wxb3e0922f6bca0f4a",
						// "timeStamp": "1627141024",
						// "nonceStr": "GzefY0zaoyjsjRXe",
						// "paySign": "F404433A04AE9B96B79012B145F29259",
						// "signType": "MD5",
						// "packageInfo": "Sign=WXPay",
						// "prepayId": "wx24233704202122aeec4351da5ad2b80000",
						// "partnerId": "1609309825",
						// "formatSignType": "MD5"
						uni.requestPayment({
						    "provider": "wxpay", 
						    "orderInfo": {
						        "appid": payData.appId,  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
						        "noncestr": payData.nonceStr, // 随机字符串
						        "package": "Sign=WXPay",        // 固定值
						        "partnerid": payData.partnerId,      // 微信支付商户号
						        "prepayid": payData.prepayId, // 统一下单订单号 
						        "timestamp": payData.timeStamp,        // 时间戳（单位：秒）
						        "sign": payData.paySign // 签名，这里用的 MD5 签名
						    },
						    success(res) {
								uni.hideLoading()
								console.log('支付成功',res)
								uni.showToast({
									title:'支付成功'
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},1000)
							},
						    fail(res) {
								uni.hideLoading()
								console.log('支付失败',res.errMsg)
								uni.showToast({
									title: res.errMsg,
									icon:'none'
								})
							}
						})
					}else{
						uni.showToast({
							title:'服务器繁忙,请稍后重试',
							icon:'none'
						})
					}
				})
			},
		}
	}
</script>

<style>
.form{
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
.title{
	font-size: 30rpx;
	color: #979797;
}
.input{
	display: flex;
	align-items: center;
}
.input text{
	font-size: 30rpx;
	color: #000000;
}
.input .line{
	font-size: 50rpx;
	color: #9c9c9c;
	font-weight: 300;
	padding-left: 16rpx;
	padding-right: 30rpx;
}
.sumbit{
	position: fixed;
	left: 35rpx;
	bottom: 20rpx;
}
.sumbit .btn{
	width: 680rpx;
	height: 120rpx;
	background: #532da3;
	border-radius: 20rpx;
	color: #FFFFFF;
	line-height: 120rpx;
}
.warn{
	color: #9c9c9c;
	font-size: 28rpx;
	text-align: center;
}
</style>
