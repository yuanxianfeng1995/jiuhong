<template>
	<view class="contain">
		<!-- <view class="header" v-if="articleList.length > 1">
			<image :src="articleList[0].mainPic ? articleList[0].mainPic : ''" mode="aspectFill" @click="routeDetail(articleList[0])"></image>
		</view> -->
		<view class="header">
			<image src="/static/image/banner1.jpg"></image>
		</view>
		<view class="content">
			<view class="list">
				<view class="item" v-for="(item,index) in articleList" :key="index" @click="routeDetail(item)">
					<view class="left">
						<view class="title u-line-2">
							<text>{{item.title}}</text>
						</view>
						<view class="tag">
							<text class="category">官方新闻</text>
							<text class="time">{{$u.timeFormat(item.createTime, 'mm/dd')}}</text>
						</view>
					</view>
					<view class="item_img">
						<image :src="item.mainPic" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//菜单
				list: [
					{
						iconPath: "/static/tabbar/i_home@2x.png",
						selectedIconPath: "/static/tabbar/i_home_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/index/index",
					},
					{
						iconPath: "/static/tabbar/Search@2x.png",
						selectedIconPath: "/static/tabbar/Search_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/find/find",
					},
					{
						iconPath: "/static/tabbar/button_float_tap@2x.png",
						selectedIconPath: "/static/tabbar/button_float_tap@2x.png",
						midButton: true,
						customIcon: false,
						"pagePath":"/pages/group-buy/group-buy",
					},
					{
						iconPath: "/static/tabbar/i_Chat@2x.png",
						selectedIconPath: "/static/tabbar/i_Chat_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/message/message",
					},
					{
						iconPath: "/static/tabbar/Bag@2x.png",
						selectedIconPath: "/static/tabbar/Bag_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/mine/mine",
					},
				],
				current: 1,
				//菜单
				articleList:[]
			}
		},
		onLoad:function(){
			this.ptArticle_list()
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.ptArticle_list()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//接口 - 列表
			ptArticle_list:function(){
				let that = this
				this.$u.api.ptArticle_list({
					current: 0,
					size: 10,
					params: {},
				}).then(res => {
					that.articleList = res.data.records
				})
			},
			//路由 - 详情FF
			routeDetail:function(item){
				uni.navigateTo({
					url:'find-detail/find-detail?id=' + item.id
				})
			},
		}
	}
</script>

<style>
.contain{
	padding: 20rpx;
}
.header image{
	width: 100%;
	height: 244rpx;
	border-radius: 12rpx;
}
.item{
	background: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0px 2rpx 2rpx 0px rgba(0,0,0,0.10); 
	margin-top: 20rpx;
	padding: 28rpx 22rpx;
	display: flex;
	align-items: stretch;
	justify-content: space-between;
}
.left{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 10rpx 0;
	padding-right: 10rpx;
}
.title{
	font-size: 28rpx;
	font-weight: 600;
	color: #000000;
	line-height: 50rpx;
}
.category{
	font-size: 24rpx;
	color: #532da3;
}
.time{
	font-size: 24rpx;
	color: #797979;
	padding-left: 22rpx;
}
.item_img image{
	width: 246rpx;
	height: 192rpx;
	border-radius: 12rpx;
}
</style>
