<template>
	<view class="contain">
		<view class="content">
			<view class="date">
				<view class="">周一~周五</view>
				<view class="">09:00~18:00</view>
			</view>
			<image src="/static/image/qr-code.jpg"></image>
		</view>
		<view class="bottom">
			<button class="btn" type="default" @click="call()">
				<u-icon name="phone" color="#ffffff"></u-icon>
				<text style="padding-left: 20rpx;">400-869-1955</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			call(){
				uni.makePhoneCall({
				    phoneNumber: '4008691955' 
				});
			},
		}
	}
</script>

<style>
.content{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 80rpx;
}
.content image{
	width: 400rpx;
	height: 400rpx;
	margin-top: 60rpx;
}

.date{
	font-size: 28rpx;
	color: #333;
	line-height: 60rpx;
}

.bottom{
	position: fixed;
	bottom: 60rpx;
	left: 35rpx;
}
.bottom .btn{
	width: 680rpx;
	height: 120rpx;
	background: #532da3;
	border-radius: 20rpx;
	padding: 0;
	color: #FFFFFF;
	line-height: 120rpx;
}
</style>
