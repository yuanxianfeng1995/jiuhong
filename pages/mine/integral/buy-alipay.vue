<template>
	<view class="contain">
		<view class="form">
			<view class="title">
				<text>请输入拼团积分转余额的数量</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="integral"></u-input>
			</view>
		</view>
		<view class="warn">
			<text>购买说明：1积分=1元</text>
		</view>
		<view class="sumbit">
			<button class="btn" type="default">提交</button>
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
	padding-left: 74rpx;
}
</style>
