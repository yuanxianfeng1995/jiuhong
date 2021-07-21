<template>
	<view class="contain">
		<view class="header">
			<view class="line_1">
				<text>直属粉丝：{{userInfo.ztnum}}，总 粉 丝：{{userInfo.teamnum}}</text>
			</view>
		</view>
		<view class="content">
			<view class="list">
				<view class="item" v-for="(item,index) in ptFans_list" :key="index">
					<view class="left">
						<image :src="item.headPortrait" mode="aspectFill"></image>
						<text>{{item.userNo}}<!--（ID:{{item.userNo}}）--></text>
						<text>{{item.levelName}}</text>
						<!-- <text>{{item.mobile}}</text> -->
					</view>
						<text>{{item.levelName}}</text>
					<!-- <view class="right">
						<text>参团30次</text>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ptFans_list:[],
				userInfo: {
					ztnum: 0,
					teamnum: 0
				}
			}
		},
		onLoad:function(){
			this.get_ptFans_list()
			this.get_member_info_detail()
		},
		methods: {
			//获取会员详情
			get_member_info_detail(){
				this.$u.api.get_member_info_detail().then(res => {
						if( res.code == 0 ){
							console.log('用户',res)
							this.userInfo= res.data
						}
				})
			},
			get_ptFans_list:function(){
				let that = this
				this.$u.api.get_ptFans_list({
					page: 1,
					pageSize: 20
				}).then(res=>{
					if( res.code == 0 ){
						that.ptFans_list = res.data
					}
				})
			},
		}
	}
</script>

<style>
.header{
	padding: 30rpx 26rpx;
}
.line_1{
	display: flex;
	flex-direction: column;
	font-size: 28rpx;
	color: #000000;
	line-height: 1.8;
}
.list{
	padding: 0 20rpx;
	background: #ffffff;
}
.item{
	height: 98rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.left{
	display: flex;
	align-items: center;
}
.left text{
	padding-left: 20rpx;
	font-size: 24rpx;
	color: #000000;
}
.left image{
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border: 2rpx solid #532da3;
	box-shadow: 0px 8rpx 8rpx 0px rgba(0,0,0,0.25); 
}
.right text{
	font-size: 24rpx;
	color: #000000;
}
</style>
