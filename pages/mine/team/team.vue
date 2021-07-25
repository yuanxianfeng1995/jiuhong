<template>
	<view class="contain">
		<view class="header">
			<view class="line_1">
				<view class="line-item">
					<text>直属会员：{{userInfo.ztnum}}</text>
					<text>团队人数：{{userInfo.teamnum}}</text>
				</view>
				<view class="line-item">
					<text>活跃人数：{{userInfo.ztactivenum}}</text>
					<text>团队活跃人数：{{userInfo.teamactivenum}}</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content-header">直推会员列表</view>
			<view class="list">
				<view class="item" v-for="(item,index) in ptFans_list" :key="index">
					<image class="img" :src="item.headPortrait" mode="aspectFill"></image>
					<view class="left">
						<text>{{item.userNo}}</text>
						<text>{{item.levelName}}</text>
					</view>
					<view class="right">
						<text>等级: {{item.levelName}}</text>
						<text>团队人数: {{item.levelName}}</text>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="'nomore'" :bg-color="'#F8F7F7'"  v-if="loadmoreShow" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ptFans_list:[],
				current:1,
				userInfo: {
					ztnum: 0,
					teamnum: 0
				},
				reachBottomOpen:true,
				loadmoreShow:false,
			}
		},
		onReachBottom:function(){
			if( this.reachBottomOpen ){
				this.current = this.current + 1
				this.get_ptFans_list()
				// if( this.tagCurrent == 1 ){
				// 	this.ptUserAccount_bonusRecord(0)
				// }else{
				// 	this.ptUserAccount_bonusRecord(1)
				// }
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
					page: this.current,
					pageSize: 20
				}).then(res=>{
					if( res.code == 0 ){
						that.ptFans_list = res.data
						if( res.data.length < 20 ){
							that.reachBottomOpen = false
						}
						if( res.data.length == 0 ){
							that.loadmoreShow = true
						}else{
							that.loadmoreShow = false
						}
					}
				})
			},
		}
	}
</script>

<style>
.header{
	padding: 30rpx 26rpx;
	background-color: #6d2ef3;
}
.line_1{
	display: flex;
	flex-direction: column;
	font-size: 28rpx;
	color: #FFFFFF;
	line-height: 1.8;
}
.list{
	padding: 0 20rpx;
	background: #ffffff;
}
.item{
	padding: 80rpx 5%;
}
.item .img{
	width: 100rpx;
	height: 100rpx;
}
.line-item{
	display: flex;
	width: 100%;
	
}

.line-item text{
	flex: 1;
}
.item{
	height: 98rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.left{
}
.left text{
	padding-left: 20rpx;
	font-size: 24rpx;
	color: #000000;
	display: block;
	margin-bottom: 10rpx;
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
	display: block;
	margin-bottom: 10rpx;
}
.content-header{
	margin: 20rpx;
}
</style>
