<template>
	<view class="contain">
		<view class="form">
			<view class="title">
				<text>请输入余额转拼团积分的数量</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="integral"></u-input>
			</view>
		</view>
		<view class="sumbit">
			<button class="btn" type="default" @click="submit()">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:0,
				integral:''
			}
		},
		onLoad:function(option){
			console.log('可用余额',option.amount)
			this.amount = option.amount
		},
		methods: {
			submit(){
				let that = this
				//表单拦截
				if( !that.integral || that.integral  <= 0 ){
					uni.showToast({
						title:'请正确填写金额',
						icon:'none'
					})
					return
				}
				if( that.integral > this.amount ){
					uni.showToast({
						title:'余额不足',
						icon:'none'
					})
					return
				}
				const userInfo= uni.getStorageSync('userInfo');
				this.$u.api.balanceBuy({
					"amount": that.integral,
					"remark": "",
					"userId": userInfo.id
				}).then( res => {
					if( res.code == 0 ){
						uni.showToast({
							title:'购买成功'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
					}else{
						uni.showToast({
							title:'购买失败，请稍后重试',
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
