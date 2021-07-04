<template>
	<view class="contain">
		<view class="content">
			<view class="list">
				<view class="item">
					<text>当前版本号</text>
					<text>v{{version}}</text>
				</view>
			</view>
		</view>
		<view class="bottom">
			<button class="btn" type="default" @click="exit()">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version:''
			}
		},
		onLoad:function(){
			this.version = getApp().globalData.version
		},
		methods: {
			exit:function(){
				uni.clearStorage();
				uni.reLaunch({
					url:'/pages/login/login'
				})
			}
		}
	}
</script>

<style>
.list{
	margin-top: 28rpx;
}
.item{
	height: 98rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #FFFFFF;
}
.item text{
	font-size: 28rpx;
	color: #000000;
	padding: 30rpx;
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
